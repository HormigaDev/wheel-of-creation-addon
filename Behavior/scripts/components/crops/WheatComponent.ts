import { Block, BlockCustomComponent, ItemStack, world } from '@minecraft/server';
import { CropData, getBiomeTemperature, getBlockKey } from '../../config';

const WHEAT_CONFIG = {
    minHydro: 3,
    maxHydro: 8, // si pasa de 8 se pudre

    minTemp: 0.15, // No crece en hielo extremo
    maxTemp: 1.0, // Se seca en desiertos (2.0) o junglas muy calientes,

    totalGrowthTicks: 72000,

    baseDrops: 1,
    seedDrops: 2,
    stages: 7,
    deadCropId: 'woc:wheat_dead',
    rottenCrop: 'woc:wheat_rotten',
};

const WheatComponent: BlockCustomComponent = {
    onPlace(e) {
        const { block } = e;
        const currentTick = world.getAbsoluteTime();

        const cropData: CropData = {
            bornTick: currentTick,
            lastTick: currentTick,
            accumulatedGrowth: 0,
            isDead: false,
        };

        world.setDynamicProperty(getBlockKey(block), JSON.stringify(cropData));
    },

    onRandomTick(e) {
        const { block } = e;
        const key = getBlockKey(block);
        const dataStr = world.getDynamicProperty(key) as string;

        if (!dataStr) return;

        let data: CropData = JSON.parse(dataStr);
        if (data.isDead) return;

        const { x, y, z } = block.location;
        const blockBelow = block.dimension.getBlock({ x, y: y - 1, z });

        if (!blockBelow || blockBelow.typeId !== 'woc:farmland') {
            block.dimension.runCommand(`setblock ${x} ${y} ${z} air destroy`);
            world.setDynamicProperty(key, undefined);
            return;
        }

        const hydration = blockBelow.permutation.getState('woc:hydration' as any) ?? 0;

        const biome = block.dimension.getBiome(block.location);
        const temp = getBiomeTemperature(biome.id);

        if (hydration > WHEAT_CONFIG.maxHydro) {
            killCrop(block, 'rotten'); // se pudre por exceso de agua
            data.isDead = true;
            world.setDynamicProperty(key, JSON.stringify(data));
            return;
        }
        if (temp > WHEAT_CONFIG.maxTemp) {
            killCrop(block, 'dead');
            data.isDead = true;
            world.setDynamicProperty(key, JSON.stringify(data));
            return;
        }

        if (hydration < WHEAT_CONFIG.minHydro || temp < WHEAT_CONFIG.minTemp) {
            // Actualizamos lastTick para que no "salte" el tiempo perdido cuando las condiciones mejoren
            data.lastTick = world.getAbsoluteTime();
            world.setDynamicProperty(key, JSON.stringify(data));
            return;
        }

        const currentTick = world.getAbsoluteTime();
        const ticksPassed = currentTick - data.lastTick;

        const growthAmount = ticksPassed;
        data.accumulatedGrowth += growthAmount;
        data.lastTick = currentTick;

        const progressPercent = data.accumulatedGrowth / WHEAT_CONFIG.totalGrowthTicks;
        let newStage = Math.floor(progressPercent * WHEAT_CONFIG.stages);
        if (newStage > WHEAT_CONFIG.stages) newStage = WHEAT_CONFIG.stages;

        const currentStage: number = block.permutation.getState('woc:growth_stage' as any);
        if (newStage !== currentStage) {
            block.setPermutation(block.permutation.withState('woc:growth_stage' as any, newStage));
        }

        world.setDynamicProperty(key, JSON.stringify(data));
    },
    onPlayerBreak(e) {
        const { block, dimension, brokenBlockPermutation } = e;
        const key = getBlockKey(block);

        const stage: number = brokenBlockPermutation.getState('woc:growth_stage' as any) ?? 0;
        world.setDynamicProperty(key, undefined);

        if (stage < 7) {
            dimension.spawnItem(new ItemStack('minecraft:wheat_seeds', 1), block.location);
            return;
        }

        const { x, y, z } = block.location;
        const blockBelow = dimension.getBlock({ x, y: y - 1, z });

        let multiplier = 1;
        if (blockBelow && blockBelow.typeId === 'woc:farmland') {
            const fertilizerLevel =
                blockBelow.permutation.getState('woc:fertilizer_level' as any) ?? 0;
            multiplier = 1 + fertilizerLevel * 0.1;
        }

        const wheatAmount = Math.round(WHEAT_CONFIG.baseDrops * multiplier);
        const seedsAmount = Math.round(WHEAT_CONFIG.seedDrops * multiplier);

        if (wheatAmount > 0)
            dimension.spawnItem(new ItemStack('minecraft:wheat', wheatAmount), block.location);
        if (seedsAmount > 0)
            dimension.spawnItem(
                new ItemStack('minecraft:wheat_seeds', seedsAmount),
                block.location,
            );
    },
};

function killCrop(block: Block, type: 'rotten' | 'dead') {
    block.setType(WHEAT_CONFIG.deadCropId);
    block.dimension.playSound('block.crop.break', block.location);
}

export default {
    id: 'woc:wheat_logic',
    component: WheatComponent,
};
