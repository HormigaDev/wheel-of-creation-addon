import {
    Block,
    BlockComponentBlockBreakEvent,
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerBreakEvent,
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    Dimension,
    EquipmentSlot,
    GameMode,
    ItemStack,
    Player,
    world,
} from '@minecraft/server';
import { getBiomeTemperature } from '../../../config';
import { ScoreboardRepository } from '../../../data/ScoreboardRepository';
import { safeExecute } from '../../../utils/ErrorHandler';
import {
    WaterCropOptions,
    getCropQuality,
    killCrop,
    isPreferredBiome,
    handleCreativeFertilizerInteraction,
    playFertilizeEffects,
} from './crops/index';

const FERTILIZER_ITEM_ID = 'woc:fertilizer';
const MAX_FERTILIZER_LEVEL = 10;

/**
 * Componente de bloque para cultivos acuáticos (arroz)
 * El cultivo requiere estar sumergido en agua (waterlogged)
 * Estado woc:type 0 = base (sumergido), 1 = panicle (maduro, sobre el agua)
 * woc:base_stage controla el crecimiento de la base
 * woc:panicle_stage controla el crecimiento del panicle
 */
export class WaterCrop implements BlockCustomComponent {
    protected opts: WaterCropOptions;
    protected ticksPerBaseStage: number;
    protected ticksPerPanicleStage: number;

    constructor(options: WaterCropOptions) {
        this.opts = options;
        // Distribuir growthTicks entre base y panicle (70% base, 30% panicle)
        const baseTotalTicks = Math.floor(options.growthTicks * 0.7);
        const panicleTotalTicks = options.growthTicks - baseTotalTicks;
        // +1 porque maxStage es el índice máximo, no el total de stages
        this.ticksPerBaseStage = Math.floor(baseTotalTicks / (options.maxBaseStage + 1));
        this.ticksPerPanicleStage = Math.floor(panicleTotalTicks / (options.maxPanicleStage + 1));
    }

    public get id() {
        return `${this.opts.id}_logic`;
    }

    onPlace(e: BlockComponentOnPlaceEvent) {
        safeExecute(() => this.handlePlace(e), `WaterPlace.${this.opts.id}`);
    }

    onRandomTick(e: BlockComponentRandomTickEvent) {
        safeExecute(() => this.handleRandomTick(e), `WaterRandomTick.${this.opts.id}`);
    }

    onPlayerBreak(e: BlockComponentPlayerBreakEvent) {
        safeExecute(() => this.handlePlayerBreak(e), `WaterBreak.${this.opts.id}`);
    }

    onBreak(e: BlockComponentBlockBreakEvent) {
        safeExecute(() => this.handleBreak(e), 'WaterCropBreakEvent');
    }

    onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
        safeExecute(() => this.handlePlayerInteract(e), `WaterInteract.${this.opts.id}`);
    }

    private handlePlace(e: BlockComponentOnPlaceEvent) {
        const { block } = e;
        const currentTick = Math.floor(world.getAbsoluteTime());
        ScoreboardRepository.save(block, currentTick, 0, 10);
    }

    private handleRandomTick(e: BlockComponentRandomTickEvent) {
        const { block, dimension } = e;

        const blockBelow = block.below(1);
        if (!blockBelow) return;

        // Obtener el tipo actual (0 = base, 1 = panicle)
        const cropType = (block.permutation.getState('woc:type' as any) as number) ?? 0;

        // Si es panicle, procesar su crecimiento
        if (cropType === 1) {
            this.processBasePanicleGrowth(block);
            return;
        }

        // Verificar suelo válido
        if (!this.opts.validSoils.includes(blockBelow.typeId)) {
            this.breakPlant(block);
            return;
        }

        // Si no está en agua, pausar crecimiento (no mata ni se seca)
        if (!block.isWaterlogged) return;

        const stored = ScoreboardRepository.load(block);
        const currentTick = Math.floor(world.getAbsoluteTime());

        if (!stored) {
            this.onPlace({ block, dimension } as any);
            return;
        }

        const biome = dimension.getBiome(block.location);
        const temp = getBiomeTemperature(biome.id, block.location);
        const isPreferred = isPreferredBiome(biome.id, this.opts.preferredBiomes);

        // Verificar temperatura (puede morir por temperatura extrema)
        if (temp < this.opts.minTemp || temp > this.opts.maxTemp) {
            this.killPlant(block);
            return;
        }

        const deltaTicks = currentTick - stored.lastTick;
        if (deltaTicks <= 0) return;

        const growthMultiplier = isPreferred ? 1.5 : 1.0;
        const gainedProgress = Math.floor(deltaTicks * growthMultiplier);
        let newTotalProgress = stored.progress + gainedProgress;

        // Obtener stage actual de la base
        const currentBaseStage =
            (block.permutation.getState('woc:base_stage' as any) as number) ?? 0;
        const maxBaseStage = this.opts.maxBaseStage;

        // Procesar crecimiento de la base
        if (currentBaseStage < maxBaseStage) {
            let nextStage = currentBaseStage;
            while (newTotalProgress >= this.ticksPerBaseStage && nextStage < maxBaseStage) {
                newTotalProgress -= this.ticksPerBaseStage;
                nextStage++;
            }

            if (nextStage !== currentBaseStage) {
                try {
                    const p = block.permutation.withState('woc:base_stage' as any, nextStage);
                    block.setPermutation(p);
                } catch {}
            }

            ScoreboardRepository.save(block, currentTick, newTotalProgress, 10);
            return;
        }

        // Base está en max stage, crear panicle si es posible
        if (newTotalProgress >= this.ticksPerBaseStage) {
            const blockAbove = block.above(1);

            if (blockAbove && blockAbove.isAir) {
                // Crear panicle arriba
                blockAbove.setType(this.opts.id);
                try {
                    let p = blockAbove.permutation
                        .withState('woc:type' as any, 1)
                        .withState('woc:panicle_stage' as any, 0);

                    const quality = getCropQuality(block);
                    if (quality === 1) {
                        p = p.withState('woc:quality' as any, 1);
                    }
                    blockAbove.setPermutation(p);
                } catch {}

                block.dimension.playSound('dig.grass', blockAbove.location);
                ScoreboardRepository.save(block, currentTick, 0, 10);
            } else {
                // Mantener progreso máximo si no puede crecer
                ScoreboardRepository.save(block, currentTick, this.ticksPerBaseStage - 1, 10);
            }
        } else {
            ScoreboardRepository.save(block, currentTick, newTotalProgress, 10);
        }
    }

    private processBasePanicleGrowth(panicle: Block) {
        // La base controla el crecimiento del panicle
        const base = panicle.below(1);
        if (!base || base.typeId !== this.opts.id) return;

        // Si la base no está en agua, pausar
        if (!base.isWaterlogged) return;

        const stored = ScoreboardRepository.load(base);
        const currentTick = Math.floor(world.getAbsoluteTime());

        if (!stored) return;

        const deltaTicks = currentTick - stored.lastTick;
        if (deltaTicks <= 0) return;

        const biome = panicle.dimension.getBiome(panicle.location);
        const isPreferred = isPreferredBiome(biome.id, this.opts.preferredBiomes);
        const growthMultiplier = isPreferred ? 1.5 : 1.0;

        const gainedProgress = Math.floor(deltaTicks * growthMultiplier);
        let newTotalProgress = stored.progress + gainedProgress;

        const currentPanicleStage =
            (panicle.permutation.getState('woc:panicle_stage' as any) as number) ?? 0;
        const maxPanicleStage = this.opts.maxPanicleStage;

        if (currentPanicleStage < maxPanicleStage) {
            let nextStage = currentPanicleStage;
            while (newTotalProgress >= this.ticksPerPanicleStage && nextStage < maxPanicleStage) {
                newTotalProgress -= this.ticksPerPanicleStage;
                nextStage++;
            }

            if (nextStage !== currentPanicleStage) {
                try {
                    const p = panicle.permutation.withState('woc:panicle_stage' as any, nextStage);
                    panicle.setPermutation(p);
                } catch {}
            }
        }

        ScoreboardRepository.save(base, currentTick, newTotalProgress, 10);
    }

    private handlePlayerInteract(e: BlockComponentPlayerInteractEvent) {
        const { block, player } = e;

        const cropType = (block.permutation.getState('woc:type' as any) as number) ?? 0;

        // Si es panicle, avanzar su stage
        if (cropType === 1) {
            handleCreativeFertilizerInteraction(player, block, () => {
                const currentStage =
                    (block.permutation.getState('woc:panicle_stage' as any) as number) ?? 0;
                const maxStage = this.opts.maxPanicleStage;
                if (currentStage < maxStage) {
                    try {
                        const p = block.permutation.withState(
                            'woc:panicle_stage' as any,
                            currentStage + 1,
                        );
                        block.setPermutation(p);
                    } catch {}
                    return true;
                }
                return false;
            });
            return;
        }

        // Es base - primero verificar fertilizante normal
        if (this.tryApplyFertilizer(block, player)) {
            return;
        }

        // Fertilizante creativo para avanzar stages
        handleCreativeFertilizerInteraction(player, block, () => {
            const currentBaseStage =
                (block.permutation.getState('woc:base_stage' as any) as number) ?? 0;
            const maxBaseStage = this.opts.maxBaseStage;

            // Si la base no está en max, avanzar base
            if (currentBaseStage < maxBaseStage) {
                try {
                    const p = block.permutation.withState(
                        'woc:base_stage' as any,
                        currentBaseStage + 1,
                    );
                    block.setPermutation(p);
                } catch {}
                return true;
            }

            // Base está en max, crear panicle si no existe
            const blockAbove = block.above(1);
            if (blockAbove && blockAbove.isAir) {
                blockAbove.setType(this.opts.id);
                try {
                    let p = blockAbove.permutation
                        .withState('woc:type' as any, 1)
                        .withState('woc:panicle_stage' as any, 0);

                    const quality = getCropQuality(block);
                    if (quality === 1) {
                        p = p.withState('woc:quality' as any, 1);
                    }
                    blockAbove.setPermutation(p);
                } catch {}
                return true;
            }

            // Si ya existe panicle, avanzar su stage
            if (blockAbove && blockAbove.typeId === this.opts.id) {
                const panicleStage =
                    (blockAbove.permutation.getState('woc:panicle_stage' as any) as number) ?? 0;
                const maxPanicleStage = this.opts.maxPanicleStage;
                if (panicleStage < maxPanicleStage) {
                    try {
                        const p = blockAbove.permutation.withState(
                            'woc:panicle_stage' as any,
                            panicleStage + 1,
                        );
                        blockAbove.setPermutation(p);
                    } catch {}
                    return true;
                }
            }

            return false;
        });
    }

    /**
     * Intenta aplicar fertilizante normal a la base del arroz
     * Aumenta woc:fertilizer_level hasta un máximo de 10
     */
    private tryApplyFertilizer(block: Block, player: Player | undefined): boolean {
        if (!player) return false;

        const equipment = player.getComponent('minecraft:equippable');
        if (!equipment) return false;

        const itemStack = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (!itemStack || itemStack.typeId !== FERTILIZER_ITEM_ID) return false;

        const currentLevel =
            (block.permutation.getState('woc:fertilizer_level' as any) as number) ?? 0;

        if (currentLevel >= MAX_FERTILIZER_LEVEL) return false;

        // Aumentar nivel de fertilizante
        const newLevel = currentLevel + 1;
        try {
            block.setPermutation(
                block.permutation.withState('woc:fertilizer_level' as any, newLevel),
            );
        } catch {
            return false;
        }

        // Efectos visuales y sonido
        playFertilizeEffects(block);

        // Consumir item si no está en creativo
        if (player.getGameMode() !== GameMode.Creative) {
            if (itemStack.amount > 1) {
                itemStack.amount -= 1;
                equipment.setEquipment(EquipmentSlot.Mainhand, itemStack);
            } else {
                equipment.setEquipment(EquipmentSlot.Mainhand, undefined);
            }
        }

        return true;
    }

    private handlePlayerBreak(e: BlockComponentPlayerBreakEvent) {
        const { block, dimension, player, brokenBlockPermutation } = e;

        const cropType = (brokenBlockPermutation.getState('woc:type' as any) as number) ?? 0;
        const quality = (brokenBlockPermutation.getState('woc:quality' as any) as number) ?? 0;

        // Obtener panicleStage y fertilizer_level antes de destruir
        let panicleStage = 0;
        let fertilizerLevel = 0;

        if (cropType === 1) {
            // Si es panicle, obtener datos de la base
            panicleStage =
                (brokenBlockPermutation.getState('woc:panicle_stage' as any) as number) ?? 0;
            const below = block.below(1);
            if (below && below.typeId === this.opts.id) {
                fertilizerLevel =
                    (below.permutation.getState('woc:fertilizer_level' as any) as number) ?? 0;
            }
        } else {
            // Si es base, obtener fertilizer_level de la propia base
            fertilizerLevel =
                (brokenBlockPermutation.getState('woc:fertilizer_level' as any) as number) ?? 0;
            const above = block.above(1);
            if (above && above.typeId === this.opts.id) {
                panicleStage =
                    (above.permutation.getState('woc:panicle_stage' as any) as number) ?? 0;
            }
        }

        // Si se rompe el panicle, romper la base también
        if (cropType === 1) {
            const below = block.below(1);
            if (below && below.typeId === this.opts.id) {
                ScoreboardRepository.delete(below);
                below.setType('minecraft:air');
            }
        } else {
            // Si se rompe la base, romper el panicle también
            ScoreboardRepository.delete(block);
            const above = block.above(1);
            if (above && above.typeId === this.opts.id) {
                above.setType('minecraft:air');
            }
        }

        if (player?.getGameMode() === GameMode.Creative) return;

        const hasPanicle =
            cropType === 1 || panicleStage > 0 || block.above(1)?.typeId === this.opts.id;
        this.spawnDrops(dimension, block, hasPanicle, quality, panicleStage, fertilizerLevel);
    }

    private handleBreak(e: BlockComponentBlockBreakEvent) {
        const { block, dimension, brokenBlockPermutation } = e;

        const cropType = (brokenBlockPermutation.getState('woc:type' as any) as number) ?? 0;
        const quality = (brokenBlockPermutation.getState('woc:quality' as any) as number) ?? 0;

        // Obtener panicleStage y fertilizer_level antes de destruir
        let panicleStage = 0;
        let fertilizerLevel = 0;

        if (cropType === 1) {
            // Si es panicle, obtener datos de la base
            panicleStage =
                (brokenBlockPermutation.getState('woc:panicle_stage' as any) as number) ?? 0;
            const below = block.below(1);
            if (below && below.typeId === this.opts.id) {
                fertilizerLevel =
                    (below.permutation.getState('woc:fertilizer_level' as any) as number) ?? 0;
            }
        } else {
            // Si es base, obtener fertilizer_level de la propia base
            fertilizerLevel =
                (brokenBlockPermutation.getState('woc:fertilizer_level' as any) as number) ?? 0;
            const above = block.above(1);
            if (above && above.typeId === this.opts.id) {
                panicleStage =
                    (above.permutation.getState('woc:panicle_stage' as any) as number) ?? 0;
            }
        }

        // Si se rompe el panicle, romper la base también
        if (cropType === 1) {
            const below = block.below(1);
            if (below && below.typeId === this.opts.id) {
                ScoreboardRepository.delete(below);
                below.setType('minecraft:air');
            }
        } else {
            // Si se rompe la base, romper el panicle también
            ScoreboardRepository.delete(block);
            const above = block.above(1);
            if (above && above.typeId === this.opts.id) {
                above.setType('minecraft:air');
            }
        }

        const hasPanicle = cropType === 1 || panicleStage > 0;
        this.spawnDrops(dimension, block, hasPanicle, quality, panicleStage, fertilizerLevel);
    }

    private spawnDrops(
        dimension: Dimension,
        block: Block,
        hasPanicle: boolean,
        quality: number,
        panicleStage: number,
        fertilizerLevel: number = 0,
    ) {
        const dropPos = block.center();
        const isWild = quality === 0;

        // Si no tiene panicle (inmaduro), solo devuelve semilla
        if (!hasPanicle) {
            const seedToDrop = isWild ? this.opts.dropItemId : this.opts.selectSeedId;
            dimension.spawnItem(new ItemStack(seedToDrop, 1), dropPos);
            return;
        }

        // Tiene panicle - drops basados en el stage del panicle
        const maxPanicleStage = this.opts.maxPanicleStage;

        // Si panicle no está maduro, solo semilla
        if (panicleStage < maxPanicleStage) {
            const seedToDrop = isWild ? this.opts.dropItemId : this.opts.selectSeedId;
            dimension.spawnItem(new ItemStack(seedToDrop, 1), dropPos);
            return;
        }

        // Panicle maduro - dar drops completos
        let multiplier = 1.0;

        const biome = dimension.getBiome(block.location);
        if (isPreferredBiome(biome.id, this.opts.preferredBiomes)) {
            multiplier *= 1.5;
        }

        if (isWild) {
            multiplier *= 0.5;
        }

        // Aplicar multiplicador por fertilizante (mismo sistema que otros cultivos)
        multiplier += fertilizerLevel * 0.5;

        const cropAmount = Math.round(this.opts.baseDrops * multiplier);
        if (cropAmount > 0) {
            dimension.spawnItem(new ItemStack(this.opts.dropItemId, cropAmount), dropPos);
        }

        // Seeds adicionales para panicle maduro
        const seedMultiplier = isWild ? 0 : 1 + (multiplier - 1) * 0.2;
        const seedAmount = isWild ? 0 : Math.round(this.opts.seedDrops * seedMultiplier);
        if (seedAmount > 0) {
            dimension.spawnItem(new ItemStack(this.opts.selectSeedId, seedAmount), dropPos);
        }
    }

    private breakPlant(block: Block) {
        const quality = getCropQuality(block);
        const isWild = quality === 0;
        const seedToDrop = isWild ? this.opts.dropItemId : this.opts.selectSeedId;

        block.dimension.spawnItem(new ItemStack(seedToDrop, 1), block.center());
        block.setType('minecraft:air');
        ScoreboardRepository.delete(block);
    }

    private killPlant(block: Block) {
        // Destruir panicle si existe
        const above = block.above(1);
        if (above && above.typeId === this.opts.id) {
            above.dimension.spawnItem(new ItemStack(this.opts.dropItemId, 1), above.center());
            above.setType('minecraft:air');
        }

        killCrop({
            block,
            deathType: 'dead',
            variant: this.opts.variant,
            deadBlockType: 'column',
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
