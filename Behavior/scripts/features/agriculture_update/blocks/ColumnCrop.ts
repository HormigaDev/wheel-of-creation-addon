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
import { safeExecute } from '../../../utils/ErrorHandler';
import {
    ColumnCropOptions,
    DEAD_CROP_BLOCKS,
    getCropQuality,
    getProducedCount,
    setProducedCount,
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
        const below = block.below(1);
        // Si el bloque de abajo es del mismo tipo, es un segmento superior
        if (below && below.typeId === this.opts.id) return;

        const currentTick = Math.floor(world.getAbsoluteTime());
        ScoreboardRepository.save(block, currentTick, 0, 0);
        setProducedCount(block, 0);
    }

    private handleRandomTick(e: BlockComponentRandomTickEvent) {
        const { block, dimension } = e;

        const blockBelow = block.below(1);
        if (!blockBelow) return;
        // Si el bloque de abajo es del mismo tipo, es un segmento superior (no procesar)
        if (blockBelow.typeId === this.opts.id) return;

        // Verificar suelo válido
        if (!this.opts.validSoils.includes(blockBelow.typeId)) {
            this.breakColumn(block);
            return;
        }

        // Verificar agua adyacente (requerido para cultivos de columna)
        if (!hasAdjacentWater(blockBelow)) {
            this.breakColumn(block);
            return;
        }

        const stored = ScoreboardRepository.load(block);
        const currentTick = Math.floor(world.getAbsoluteTime());

        if (!stored) {
            this.onPlace({ block, dimension } as any);
            return;
        }

        const biome = dimension.getBiome(block.location);
        const risks = getBiomeRisks(biome.id);
        const temp = getBiomeTemperature(biome.id, block.location);
        const isPreferred = isPreferredBiome(biome.id, this.opts.preferredBiomes);

        // Verificar temperatura
        if (temp < this.opts.minTemp || temp > this.opts.maxTemp) {
            this.killColumn(block, 'dead');
            return;
        }

        // Verificar pudrición (solo cultivos no acuáticos puros)
        if (this.opts.maxHydro < 10 && risks.rotChance > 0 && !isPreferred) {
            if (Math.random() < risks.rotChance) {
                this.killColumn(block, 'rotten');
                return;
            }
        }

        const deltaTicks = currentTick - stored.lastTick;
        if (deltaTicks <= 0) return;

        const growthMultiplier = isPreferred ? 1.5 : 1.0;
        const gainedProgress = Math.floor(deltaTicks * growthMultiplier);
        const newTotalProgress = stored.progress + gainedProgress;

        // Procesar crecimiento de columna
        this.processColumnGrowth(block, newTotalProgress, currentTick);
    }

    private processColumnGrowth(block: Block, progress: number, currentTick: number) {
        let newTotalProgress = progress;
        let { currentHeight, airBlock } = this.scanUpwards(block);

        while (
            newTotalProgress >= this.opts.growthTicks &&
            currentHeight < this.opts.maxHeight &&
            airBlock
        ) {
            const produced = getProducedCount(block);
            const maxLifeGrowths = this.opts.maxLifeGrowths;

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

            newTotalProgress -= this.opts.growthTicks;
            currentHeight++;
            airBlock = airBlock.above(1);

            if (!airBlock || !airBlock.isAir) break;
        }

        if (currentHeight >= this.opts.maxHeight) {
            newTotalProgress = Math.min(newTotalProgress, this.opts.growthTicks - 1);
        }

        ScoreboardRepository.save(block, currentTick, newTotalProgress, 0);
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

        const biome = dimension.getBiome(block.location);
        if (isPreferredBiome(biome.id, this.opts.preferredBiomes)) {
            multiplier = 1.5;
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
            deadBlockId: DEAD_CROP_BLOCKS.column,
            variant: this.opts.variant,
        });
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
