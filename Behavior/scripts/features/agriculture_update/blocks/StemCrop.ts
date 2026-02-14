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
import { ScoreboardRepository } from '../../../data/ScoreboardRepository';
import { safeExecute } from '../../../utils/ErrorHandler';
import {
    StemCropOptions,
    DEAD_CROP_BLOCKS,
    WOC_FARMLAND_ID,
    getHydration,
    getFertilizerLevel,
    tryConsumeFertilizer,
    getGrowthStage,
    setGrowthStage,
    getCropQuality,
    getProducedCount,
    setProducedCount,
    turnToWeed,
    killCrop,
    isPreferredBiome,
    analyzeEnvironment,
    checkSurvival,
    shouldBecomeWeed,
    calculateGrowthMultiplier,
    isDormant,
    handleCreativeFertilizerInteraction,
} from './crops/index';

interface ExtendedStemCropOptions extends StemCropOptions {
    immuneToWeeds?: boolean;
}

/**
 * Componente de bloque para cultivos de tallo (calabaza, melón)
 */
export class StemCrop implements BlockCustomComponent {
    protected opts: ExtendedStemCropOptions;

    constructor(opt: ExtendedStemCropOptions) {
        this.opts = opt;
    }

    public get id() {
        return `${this.opts.id}_logic`;
    }

    onPlace(e: BlockComponentOnPlaceEvent) {
        safeExecute(() => this.handlePlace(e), `StemPlace.${this.opts.id}`);
    }

    onPlayerBreak(e: BlockComponentPlayerBreakEvent) {
        safeExecute(() => this.handlePlayerBreak(e), `StemBreak.${this.opts.id}`);
    }

    onRandomTick(e: BlockComponentRandomTickEvent) {
        safeExecute(() => this.handleRandomTick(e), `StemRandomTick.${this.opts.id}`);
    }

    onBreak(e: BlockComponentBlockBreakEvent) {
        safeExecute(() => this.handleBreak(e), 'StemCropBreakEvent');
    }

    onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
        safeExecute(() => this.handlePlayerInteract(e), `StemInteract.${this.opts.id}`);
    }

    private handlePlace(e: BlockComponentOnPlaceEvent) {
        const { block, dimension } = e;

        const blockBelow = dimension.getBlock({
            x: block.location.x,
            y: block.location.y - 1,
            z: block.location.z,
        });

        if (this.tryBreakBlock(blockBelow, dimension, block)) return;

        const currentTick = Math.floor(world.getAbsoluteTime());
        const hydration = getHydration(blockBelow);
        ScoreboardRepository.save(block, currentTick, 0, hydration);

        setProducedCount(block, 0);
    }

    private handleRandomTick(e: BlockComponentRandomTickEvent) {
        const { block, dimension } = e;

        const blockBelow = dimension.getBlock({ x: block.x, y: block.y - 1, z: block.z });
        if (this.tryBreakBlock(blockBelow, dimension, block)) return;
        if (!blockBelow) return;

        const stored = ScoreboardRepository.load(block);
        const currentTick = Math.floor(world.getAbsoluteTime());

        if (!stored) {
            this.onPlace({ block, dimension } as any);
            return;
        }

        // Consumir fertilizante gradualmente
        if (blockBelow.typeId === WOC_FARMLAND_ID) {
            tryConsumeFertilizer(blockBelow, 0.03);
        }

        const env = analyzeEnvironment(block, blockBelow, this.opts);
        const currentStage = getGrowthStage(block);

        // Verificar conversión a maleza (solo en fase de crecimiento)
        if (currentStage < 7 && !this.opts.immuneToWeeds) {
            const isSand = blockBelow.typeId.includes('sand');
            if (!isSand && shouldBecomeWeed(env, this.opts, currentStage, 7)) {
                turnToWeed(block);
                return;
            }
        }

        // Verificar supervivencia
        const survival = checkSurvival(env, this.opts);
        if (survival.shouldDie) {
            this.killCrop(block, survival.deathType!);
            return;
        }

        // Dormancia por frío
        if (isDormant(env.temperature, this.opts.minTemp)) {
            ScoreboardRepository.save(block, currentTick, stored.progress, env.hydration);
            return;
        }

        const deltaTicks = currentTick - stored.lastTick;
        if (deltaTicks <= 0) return;

        const growthMultiplier = calculateGrowthMultiplier(env, this.opts);

        // Fase de crecimiento del tallo
        if (currentStage < 7) {
            this.processGrowthPhase(
                block,
                currentTick,
                stored,
                deltaTicks,
                growthMultiplier,
                env.hydration,
            );
            return;
        }

        // Fase de producción de frutos
        this.processFruitPhase(block, currentTick, stored, deltaTicks, growthMultiplier, env);
    }

    private processGrowthPhase(
        block: Block,
        currentTick: number,
        stored: { progress: number; lastTick: number },
        deltaTicks: number,
        growthMultiplier: number,
        hydration: number,
    ) {
        const ticksPerStage = Math.floor(this.opts.growthTicks / 7);
        const gainedProgress = Math.floor(deltaTicks * growthMultiplier);
        let newTotalProgress = stored.progress + gainedProgress;
        let currentStage = getGrowthStage(block);
        let stageChanged = false;

        while (newTotalProgress >= ticksPerStage && currentStage < 7) {
            newTotalProgress -= ticksPerStage;
            currentStage++;
            stageChanged = true;
        }

        if (stageChanged) {
            setGrowthStage(block, currentStage);
            if (currentStage >= 7) newTotalProgress = 0;
        }

        ScoreboardRepository.save(block, currentTick, newTotalProgress, hydration);
    }

    private processFruitPhase(
        block: Block,
        currentTick: number,
        stored: { progress: number; lastTick: number },
        deltaTicks: number,
        growthMultiplier: number,
        env: ReturnType<typeof analyzeEnvironment>,
    ) {
        const gainedFruitProgress = Math.floor(deltaTicks * growthMultiplier);
        let currentFruitProgress = stored.progress + gainedFruitProgress;

        if (currentFruitProgress >= this.opts.fruitTicks) {
            const maxLifeProduction = this.calculateMaxProduction(env);
            const produced = getProducedCount(block);

            if (produced >= maxLifeProduction) {
                this.killCrop(block, 'dead');
                return;
            }

            const success = this.attemptSpawnFruit(block, produced + 1);
            currentFruitProgress = success ? 0 : this.opts.fruitTicks;
        }

        ScoreboardRepository.save(block, currentTick, currentFruitProgress, env.hydration);
    }

    private calculateMaxProduction(env: ReturnType<typeof analyzeEnvironment>): number {
        if (env.isWild) {
            return Math.min(2, this.opts.minFruits);
        }

        let baseLife = this.opts.minFruits;
        if (env.isPreferred) baseLife += 2;

        const fertilizerBonus = Math.floor(env.fertilizerLevel / 2);
        return Math.min(this.opts.maxFruit, baseLife + fertilizerBonus);
    }

    private attemptSpawnFruit(stem: Block, nextCount: number): boolean {
        const directions = [
            { x: 1, z: 0, state: 'woc:conn_e' },
            { x: -1, z: 0, state: 'woc:conn_w' },
            { x: 0, z: 1, state: 'woc:conn_s' },
            { x: 0, z: -1, state: 'woc:conn_n' },
        ];

        const shuffled = directions.sort(() => Math.random() - 0.5);

        for (const dir of shuffled) {
            const target = stem.offset({ x: dir.x, y: 0, z: dir.z });
            if (!target) continue;

            const ground = target.below(1);
            if (!ground) continue;

            if (target.isAir && !ground.isAir && !ground.isLiquid) {
                try {
                    target.setType(this.opts.fruitBlockId);
                    stem.dimension.playSound('block.grass.place', target.location);
                } catch {
                    return false;
                }

                try {
                    const newPerm = stem.permutation
                        .withState('woc:produced_count' as any, Math.min(10, nextCount))
                        .withState('woc:connected' as any, true)
                        .withState(dir.state as any, true);
                    stem.setPermutation(newPerm);
                } catch {}

                return true;
            }
        }
        return false;
    }

    private handlePlayerInteract(e: BlockComponentPlayerInteractEvent) {
        const { block, player } = e;
        const currentStage = getGrowthStage(block);

        handleCreativeFertilizerInteraction(player, block, () => {
            if (currentStage < 7) {
                setGrowthStage(block, 7);
                return true;
            }

            const produced = getProducedCount(block);
            return this.attemptSpawnFruit(block, produced + 1);
        });
    }

    private handlePlayerBreak(e: BlockComponentPlayerBreakEvent) {
        const { block, dimension, player } = e;
        ScoreboardRepository.delete(block);

        if (player?.getGameMode() === GameMode.Creative) return;

        this.spawnSeedDrops(block, dimension);
    }

    private handleBreak(e: BlockComponentBlockBreakEvent) {
        const { block, dimension } = e;
        ScoreboardRepository.delete(block);
        this.spawnSeedDrops(block, dimension);
    }

    private spawnSeedDrops(block: Block, dimension: Dimension) {
        const quality = getCropQuality(block);
        const isWild = quality === 0;

        let seedAmount = 0;
        if (isWild) {
            if (Math.random() < 0.4) seedAmount = 1;
        } else {
            seedAmount = 1;
            if (Math.random() < 0.2) seedAmount = 2;
        }

        const biome = dimension.getBiome(block.location);
        if (isPreferredBiome(biome.id, this.opts.preferredBiomes) && seedAmount > 0) {
            if (Math.random() < 0.5) seedAmount++;
        }

        if (seedAmount > 0) {
            const itemToDrop = isWild ? this.opts.seedId : this.opts.selectSeedId;
            dimension.spawnItem(new ItemStack(itemToDrop, seedAmount), block.center());
        }
    }

    private tryBreakBlock(below: Block | undefined, dimension: Dimension, block: Block): boolean {
        if (below?.typeId === WOC_FARMLAND_ID) return false;

        const quality = getCropQuality(block);
        const isWild = quality === 0;
        const seedToDrop = isWild ? this.opts.seedId : this.opts.selectSeedId;

        dimension.spawnItem(new ItemStack(seedToDrop, 1), block.center());
        dimension.runCommand(`setblock ${block.x} ${block.y} ${block.z} air destroy`);
        ScoreboardRepository.delete(block);
        return true;
    }

    private killCrop(block: Block, type: 'rotten' | 'dead') {
        const stage = getGrowthStage(block);

        killCrop({
            block,
            deathType: type,
            deadBlockId: DEAD_CROP_BLOCKS.stem,
            variant: this.opts.variant,
            currentStage: stage,
        });
    }

    toProxy(): BlockCustomComponent {
        return {
            onPlace: this.onPlace.bind(this),
            onPlayerBreak: this.onPlayerBreak.bind(this),
            onRandomTick: this.onRandomTick.bind(this),
            onBreak: this.onBreak.bind(this),
            onPlayerInteract: this.onPlayerInteract.bind(this),
        };
    }
}
