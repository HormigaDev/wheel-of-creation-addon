import {
    Block,
    BlockComponentBlockBreakEvent,
    BlockComponentOnPlaceEvent,
    BlockComponentPlayerBreakEvent,
    BlockComponentPlayerInteractEvent,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    BlockPermutation,
    Dimension,
    GameMode,
    ItemStack,
    world,
} from '@minecraft/server';
import { ScoreboardRepository } from '../../../data/ScoreboardRepository';
import { safeExecute } from '../../../utils/ErrorHandler';
import {
    CropOptions,
    getBaseCropVariant,
    WOC_FARMLAND_ID,
    getHydration,
    getFertilizerLevel,
    getGrowthStage,
    setGrowthStage,
    getCropQuality,
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

/**
 * Componente de bloque para cultivos base (trigo, zanahoria, papa, remolacha)
 */
export class Crop implements BlockCustomComponent {
    protected opts: CropOptions;
    protected ticksPerStage: number;

    constructor(opt: CropOptions) {
        this.opts = opt;
        this.ticksPerStage = Math.floor(opt.growthTicks / opt.stages);
    }

    public get id(): string {
        return `${this.opts.id}_logic`;
    }

    onPlace(e: BlockComponentOnPlaceEvent) {
        safeExecute(() => this.handlePlace(e), `${this.opts.id}.onPlace`);
    }

    onRandomTick(e: BlockComponentRandomTickEvent) {
        safeExecute(() => this.handleRandomTick(e), `${this.opts.id}.onRandomTick`);
    }

    onPlayerBreak(e: BlockComponentPlayerBreakEvent) {
        safeExecute(() => this.handlePlayerBreak(e), `${this.opts.id}.onPlayerDestroy`);
    }

    onBreak(e: BlockComponentBlockBreakEvent) {
        safeExecute(() => this.handleBreak(e), `${this.opts.id}.onBreak`);
    }

    onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
        safeExecute(() => this.handlePlayerInteract(e), `${this.opts.id}.onPlayerInteract`);
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

        const env = analyzeEnvironment(block, blockBelow, this.opts);
        const currentStage = getGrowthStage(block);

        // Verificar conversión a maleza
        const weedThreshold = Math.max(1, this.opts.stages - 2);
        if (shouldBecomeWeed(env, this.opts, currentStage, weedThreshold)) {
            turnToWeed(block);
            return;
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

        // Calcular crecimiento
        const deltaTicks = currentTick - stored.lastTick;
        if (deltaTicks <= 0) return;

        const growthMultiplier = calculateGrowthMultiplier(env, this.opts);
        const gainedProgress = Math.floor(deltaTicks * growthMultiplier);
        let newTotalProgress = stored.progress + gainedProgress;

        let nextStage = currentStage;
        let stageChanged = false;

        while (newTotalProgress >= this.ticksPerStage && nextStage < this.opts.stages) {
            newTotalProgress -= this.ticksPerStage;
            nextStage++;
            stageChanged = true;
        }

        if (stageChanged) {
            setGrowthStage(block, nextStage);
            if (nextStage >= this.opts.stages) {
                newTotalProgress = 0;
            }
        }

        ScoreboardRepository.save(block, currentTick, newTotalProgress, env.hydration);
    }

    private handlePlayerInteract(e: BlockComponentPlayerInteractEvent) {
        const { block, player } = e;
        const currentStage = getGrowthStage(block);

        if (currentStage >= this.opts.stages) return;

        handleCreativeFertilizerInteraction(player, block, () => {
            setGrowthStage(block, currentStage + 1);
            return true;
        });
    }

    private handleBreak(e: BlockComponentBlockBreakEvent) {
        const { block, dimension, brokenBlockPermutation } = e;
        ScoreboardRepository.delete(block);

        const stage = (brokenBlockPermutation.getState('woc:growth_stage' as any) as number) ?? 0;
        const quality = (brokenBlockPermutation.getState('woc:quality' as any) as number) ?? 0;
        this.spawnDrops(dimension, block, stage, quality);
    }

    private handlePlayerBreak(e: BlockComponentPlayerBreakEvent) {
        const { block, dimension, player, brokenBlockPermutation } = e;
        ScoreboardRepository.delete(block);

        if (player?.getGameMode() === GameMode.Creative) return;

        const stage = (brokenBlockPermutation.getState('woc:growth_stage' as any) as number) ?? 0;
        const quality = (brokenBlockPermutation.getState('woc:quality' as any) as number) ?? 0;
        this.spawnDrops(dimension, block, stage, quality);
    }

    private spawnDrops(dimension: Dimension, block: Block, stage: number, quality: number) {
        const dropPos = block.center();
        const isWild = quality === 0;

        // Si no está maduro, solo devuelve semilla
        if (stage < this.opts.stages) {
            const seedToDrop = isWild ? this.opts.dropSeedsId : this.opts.selectSeedId;
            if (seedToDrop) {
                try {
                    dimension.spawnItem(new ItemStack(seedToDrop, 1), dropPos);
                } catch {}
            }
            return;
        }

        const blockBelow = dimension.getBlock({
            x: block.location.x,
            y: block.location.y - 1,
            z: block.location.z,
        });

        let multiplier = this.calculateDropMultiplier(dimension, block, blockBelow, isWild);

        // Consumir fertilizante del suelo
        const fertilizerLevel = getFertilizerLevel(blockBelow);
        if (fertilizerLevel > 0 && blockBelow) {
            blockBelow.setPermutation(
                BlockPermutation.resolve(WOC_FARMLAND_ID, {
                    'woc:fertilizer_level': fertilizerLevel - 1,
                }),
            );
        }

        // Calcular y spawnear drops
        const cropAmount = Math.round(this.opts.baseDrops * multiplier);
        let seedAmount = 0;

        if (isWild) {
            if (Math.random() > 0.5) seedAmount = 1;
        } else {
            const seedMultiplier = 1 + (multiplier - 1) * 0.2;
            seedAmount = Math.round(this.opts.seedDrops * seedMultiplier);
        }

        if (cropAmount > 0 && this.opts.dropItemId) {
            dimension.spawnItem(new ItemStack(this.opts.dropItemId, cropAmount), dropPos);
        }

        if (seedAmount > 0 && this.opts.dropSeedsId) {
            dimension.spawnItem(new ItemStack(this.opts.dropSeedsId, seedAmount), dropPos);
        }
    }

    private calculateDropMultiplier(
        dimension: Dimension,
        block: Block,
        blockBelow: Block | undefined,
        isWild: boolean,
    ): number {
        let multiplier = 1.0;

        if (isWild) multiplier *= 0.5;

        const biome = dimension.getBiome(block.location);
        if (isPreferredBiome(biome.id, this.opts.preferredBiomes)) {
            multiplier *= 1.5;
        }

        if (blockBelow?.typeId === WOC_FARMLAND_ID) {
            const hydration = getHydration(blockBelow);
            const fertilizerLevel = getFertilizerLevel(blockBelow);

            multiplier += fertilizerLevel * 0.5;

            const idealHydro = (this.opts.minHydro + this.opts.maxHydro) / 2;
            const maxDist = (this.opts.maxHydro - this.opts.minHydro) / 2;

            if (hydration < this.opts.minHydro || hydration > this.opts.maxHydro) {
                multiplier *= 0.5;
            } else if (maxDist === 0) {
                multiplier *= 1.2;
            } else {
                const distance = Math.abs(hydration - idealHydro);
                const qFactor = 1.0 - distance / maxDist;
                multiplier *= 1 + qFactor * 0.2;
            }
        }

        return multiplier;
    }

    private tryBreakBlock(below: Block | undefined, dimension: Dimension, block: Block): boolean {
        if (below?.typeId === WOC_FARMLAND_ID) return false;

        const currentStage = getGrowthStage(block);
        const quality = getCropQuality(block);
        this.spawnDrops(dimension, block, currentStage, quality);
        dimension.runCommand(`setblock ${block.x} ${block.y} ${block.z} air destroy`);
        ScoreboardRepository.delete(block);
        return true;
    }

    private killCrop(block: Block, type: 'rotten' | 'dead') {
        const currentStage = getGrowthStage(block);
        const variantIndex = getBaseCropVariant(this.opts.id);

        killCrop({
            block,
            deathType: type,
            variant: variantIndex,
            deadBlockType: 'base',
            currentStage,
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
