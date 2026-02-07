import {
    Block,
    BlockComponentBlockBreakEvent,
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerBreakEvent,
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    Dimension,
    GameMode,
    ItemStack,
    world,
} from '@minecraft/server';
import { getBiomeRisks, getBiomeTemperature } from '../../../config';
import { ScoreboardRepository } from '../../../data/ScoreboardRepository';
import { logger, safeExecute } from '../../../utils/ErrorHandler';
import {
    ColumnCropOptions,
    WOC_FARMLAND_ID,
    getHydration,
    getFertilizerLevel,
    tryConsumeFertilizer,
    getCropQuality,
    getProducedCount,
    setProducedCount,
    turnToWeed,
    killCrop,
    hasAdjacentWater,
    isPreferredBiome,
    handleCreativeFertilizerInteraction,
} from './crops/index';

/**
 * Componente de bloque para cultivos de columna (caña de azúcar)
 */
export class ColumnCrop implements BlockCustomComponent {
    protected opts: ColumnCropOptions;

    constructor(options: ColumnCropOptions) {
        this.opts = options;
    }

    public get id() {
        return `${this.opts.id}_logic`;
    }

    onPlace(e: BlockComponentOnPlaceEvent) {
        safeExecute(() => this.handlePlace(e), `ColumnOnPlace.${this.opts.id}`);
    }

    onRandomTick(e: BlockComponentRandomTickEvent) {
        safeExecute(() => this.handleRandomTick(e), `ColumnRandomTick.${this.opts.id}`);
    }

    onPlayerBreak(e: BlockComponentPlayerBreakEvent) {
        safeExecute(() => this.handlePlayerBreak(e), `ColumnBreak.${this.opts.id}`);
    }

    onBreak(e: BlockComponentBlockBreakEvent) {
        safeExecute(() => this.handleBreak(e), 'ColumnCropBreakEvent');
    }

    onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
        safeExecute(() => this.handlePlayerInteract(e), `ColumnInteract.${this.opts.id}`);
    }

    private handlePlace(e: BlockComponentOnPlaceEvent) {
        const { block } = e;
        const currentTick = Math.floor(world.getAbsoluteTime());

        const below = block.below(1);
        if (below && below.typeId === this.opts.id) return;

        const hydration = below?.typeId === WOC_FARMLAND_ID ? getHydration(below) : 0;
        ScoreboardRepository.save(block, currentTick, 0, hydration);
        setProducedCount(block, 0);
    }

    private handleRandomTick(e: BlockComponentRandomTickEvent) {
        const { block, dimension } = e;

        const blockBelow = block.below(1);
        if (!blockBelow) return;
        if (blockBelow.typeId === this.opts.id) return;

        // Verificar suelo válido
        if (!this.opts.validSoils.includes(blockBelow.typeId)) {
            this.breakColumn(block);
            return;
        }

        // Verificar requerimiento de agua
        if (this.opts.requiredWaterSource && !this.checkWaterRequirement(blockBelow)) {
            this.breakColumn(block);
            return;
        }

        const stored = ScoreboardRepository.load(block);
        const currentTick = Math.floor(world.getAbsoluteTime());

        if (!stored) {
            this.onPlace({ block, dimension } as any);
            return;
        }

        const currentSoilHydro =
            blockBelow.typeId === WOC_FARMLAND_ID ? getHydration(blockBelow) : stored.hydration;

        const biome = dimension.getBiome(block.location);
        const risks = getBiomeRisks(biome.id);
        const temp = getBiomeTemperature(biome.id, block.location);
        const isPreferred = isPreferredBiome(biome.id, this.opts.preferredBiomes);

        // Verificar temperatura
        if (temp < this.opts.minTemp || temp > this.opts.maxTemp) {
            this.killColumn(block, 'dead');
            return;
        }

        // Verificar maleza
        if (!this.opts.immuneToWeeds) {
            const quality = getCropQuality(block);
            const isWild = quality === 0;
            const isSand = blockBelow.typeId.includes('sand');

            if (this.opts.weedProbability > 0 && isWild && !isSand) {
                const combinedWeedChance = (this.opts.weedProbability + risks.weedChance) * 0.5;
                if (combinedWeedChance > 0 && Math.random() < combinedWeedChance) {
                    this.turnToWeed(block);
                    return;
                }
            }
        }

        // Verificar pudrición
        const isImmuneToRot = this.opts.maxHydro === 10;
        if (!isImmuneToRot && risks.rotChance > 0 && Math.random() < risks.rotChance) {
            if (!isPreferred) {
                this.killColumn(block, 'rotten');
                return;
            }
        }

        // Verificar evaporación
        if (!this.opts.requiredWaterSource && risks.evaporationChance > 0.3) {
            if (!isPreferred && Math.random() < risks.evaporationChance) {
                this.killColumn(block, 'dead');
                return;
            }
        }

        const deltaTicks = currentTick - stored.lastTick;
        if (deltaTicks <= 0) return;

        let growthMultiplier = isPreferred ? 1.5 : 1.0;

        if (blockBelow.typeId === WOC_FARMLAND_ID && currentSoilHydro < this.opts.minHydro) {
            growthMultiplier *= 0.2;
        }

        const gainedProgress = Math.floor(deltaTicks * growthMultiplier);
        let newTotalProgress = stored.progress + gainedProgress;

        // Procesar crecimiento de columna
        this.processColumnGrowth(
            block,
            blockBelow,
            newTotalProgress,
            currentTick,
            currentSoilHydro,
        );
    }

    private checkWaterRequirement(blockBelow: Block): boolean {
        if (hasAdjacentWater(blockBelow)) return true;

        if (blockBelow.typeId === WOC_FARMLAND_ID) {
            const hydro = getHydration(blockBelow);
            return hydro >= this.opts.minHydro;
        }

        return false;
    }

    private processColumnGrowth(
        block: Block,
        blockBelow: Block,
        progress: number,
        currentTick: number,
        hydration: number,
    ) {
        let newTotalProgress = progress;
        let { currentHeight, airBlock } = this.scanUpwards(block);

        while (
            newTotalProgress >= this.opts.growthTicks &&
            currentHeight < this.opts.maxHeight &&
            airBlock
        ) {
            const produced = getProducedCount(block);
            const fertilizerLevel =
                blockBelow.typeId === WOC_FARMLAND_ID ? getFertilizerLevel(blockBelow) : 0;

            const maxLifeGrowths = 5 + fertilizerLevel;

            if (produced >= maxLifeGrowths) {
                this.killColumn(block, 'dead');
                return;
            }

            // Crear nuevo segmento de columna
            airBlock.setType(this.opts.id);

            const baseQuality = getCropQuality(block);
            if (baseQuality === 1) {
                try {
                    const p = airBlock.permutation.withState('woc:quality' as any, 1);
                    airBlock.setPermutation(p);
                } catch {}
            }

            block.dimension.playSound('dig.grass', airBlock.location);
            setProducedCount(block, Math.min(10, produced + 1));

            // Consumir fertilizante ocasionalmente
            if (fertilizerLevel > 0) {
                tryConsumeFertilizer(blockBelow, 0.3);
            }

            newTotalProgress -= this.opts.growthTicks;
            currentHeight++;
            airBlock = airBlock.above(1);

            if (!airBlock || !airBlock.isAir) break;
        }

        if (currentHeight >= this.opts.maxHeight) {
            newTotalProgress = Math.min(newTotalProgress, this.opts.growthTicks - 1);
        }

        ScoreboardRepository.save(block, currentTick, newTotalProgress, hydration);
    }

    private handlePlayerInteract(e: BlockComponentPlayerInteractEvent) {
        const { block, player } = e;

        let base = block;
        while (base.below(1)?.typeId === this.opts.id) {
            base = base.below(1)!;
        }

        handleCreativeFertilizerInteraction(player, block, () => {
            const { currentHeight, airBlock } = this.scanUpwards(base);

            if (currentHeight < this.opts.maxHeight && airBlock) {
                airBlock.setType(this.opts.id);

                const baseQuality = getCropQuality(base);
                if (baseQuality === 1) {
                    try {
                        const p = airBlock.permutation.withState('woc:quality' as any, 1);
                        airBlock.setPermutation(p);
                    } catch {}
                }
                return true;
            }
            return false;
        });
    }

    private handlePlayerBreak(e: BlockComponentPlayerBreakEvent) {
        const { block, dimension, player, brokenBlockPermutation } = e;
        ScoreboardRepository.delete(block);

        if (player?.getGameMode() === GameMode.Creative) return;

        const blockBelow = block.below(1);
        const isBrain = !blockBelow || blockBelow.typeId !== this.opts.id;

        this.spawnBreakDrops(block, dimension, brokenBlockPermutation, isBrain);
    }

    private handleBreak(e: BlockComponentBlockBreakEvent) {
        const { block, dimension, brokenBlockPermutation } = e;
        ScoreboardRepository.delete(block);

        const blockBelow = block.below(1);
        const isBrain = !blockBelow || blockBelow.typeId !== this.opts.id;

        this.spawnBreakDrops(block, dimension, brokenBlockPermutation, isBrain);
    }

    private spawnBreakDrops(
        block: Block,
        dimension: Dimension,
        permutation: any,
        isBrain: boolean,
    ) {
        if (isBrain) {
            const quality = (permutation.getState('woc:quality' as any) as number) ?? 0;
            const isWild = quality === 0;
            const seedToDrop = isWild ? this.opts.dropItemId : this.opts.selectSeedId;
            dimension.spawnItem(new ItemStack(seedToDrop, 1), block.center());
        } else {
            this.spawnDrops(block, dimension);
        }
    }

    private spawnDrops(block: Block, dimension: Dimension) {
        let multiplier = 1.0;

        let base = block;
        let safety = 0;
        while (base.below(1)?.typeId === this.opts.id && safety < 5) {
            base = base.below(1)!;
            safety++;
        }

        const blockBelow = base.below(1);

        if (blockBelow?.typeId === WOC_FARMLAND_ID) {
            const fertilizer = getFertilizerLevel(blockBelow);
            multiplier += fertilizer * this.opts.fertilizerDropFacor;
        }

        const biome = dimension.getBiome(block.location);
        if (isPreferredBiome(biome.id, this.opts.preferredBiomes)) {
            multiplier *= 1.5;
        }

        const dropCount = Math.round(this.opts.baseDrops * multiplier);
        if (dropCount > 0) {
            dimension.spawnItem(new ItemStack(this.opts.dropItemId, dropCount), block.center());
        }
    }

    private scanUpwards(baseBlock: Block): { currentHeight: number; airBlock: Block | undefined } {
        let height = 1;
        let pointer = baseBlock.above(1);

        while (pointer && height < this.opts.maxHeight) {
            if (pointer.typeId === this.opts.id) {
                height++;
                pointer = pointer.above(1);
            } else if (pointer.isAir) {
                return { currentHeight: height, airBlock: pointer };
            } else {
                return { currentHeight: height, airBlock: undefined };
            }
        }
        return { currentHeight: height, airBlock: undefined };
    }

    private breakColumn(baseBlock: Block) {
        const quality = getCropQuality(baseBlock);
        const isWild = quality === 0;
        const seedToDrop = isWild ? this.opts.dropItemId : this.opts.selectSeedId;

        baseBlock.dimension.spawnItem(new ItemStack(seedToDrop, 1), baseBlock.center());
        baseBlock.setType('minecraft:air');
        ScoreboardRepository.delete(baseBlock);
    }

    private killColumn(baseBlock: Block, type: 'rotten' | 'dead') {
        // Destruir segmentos superiores
        let pointer = baseBlock.above(1);
        let safety = 0;
        while (pointer && pointer.typeId === this.opts.id && safety < 5) {
            pointer.dimension.spawnItem(new ItemStack(this.opts.dropItemId, 1), pointer.center());
            pointer.setType('minecraft:air');
            pointer = pointer.above(1);
            safety++;
        }

        // Convertir base a cultivo muerto de columna
        killCrop({
            block: baseBlock,
            deathType: type,
            variant: this.opts.variant,
            deadBlockType: 'column',
        });
    }

    private turnToWeed(baseBlock: Block) {
        // Destruir segmentos superiores
        let pointer = baseBlock.above(1);
        let safety = 0;
        while (pointer && pointer.typeId === this.opts.id && safety < 5) {
            pointer.setType('minecraft:air');
            pointer = pointer.above(1);
            safety++;
        }

        // Convertir base a maleza
        turnToWeed(baseBlock);
    }

    toProxy(): BlockCustomComponent {
        return {
            onPlace: this.onPlace.bind(this),
            onPlayerBreak: this.onPlayerBreak.bind(this),
            onBreak: this.onBreak.bind(this),
            onRandomTick: this.onRandomTick.bind(this),
            onPlayerInteract: this.onPlayerInteract.bind(this),
        };
    }
}
