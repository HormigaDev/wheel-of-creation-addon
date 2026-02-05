import {
    Block,
    BlockCustomComponent,
    BlockComponentRandomTickEvent,
    BlockComponentOnPlaceEvent,
    Vector3,
} from '@minecraft/server';
import { getAtmosphericHumidity, getBiomeRisks, getBiomeTemperature } from '../../config';
import { safeExecute } from '../../utils/ErrorHandler';
import { weatherManager } from '../environment/WeatherManager';

const MAX_HYDRATION = 10;
const WATER_SEARCH_RADIUS = 3;

const FarmlandComponent: BlockCustomComponent = {
    onRandomTick(e: BlockComponentRandomTickEvent) {
        safeExecute(() => updateFarmlandLogic(e.block), 'Farmland.onRandomTick');
    },
    onPlace(e: BlockComponentOnPlaceEvent) {
        safeExecute(() => updateFarmlandLogic(e.block), 'Farmland.onPlace');
    },
};

function updateFarmlandLogic(block: Block) {
    const dimension = block.dimension;
    const biome = dimension.getBiome(block.location);
    const location = block.location;

    let currentHydration = (block.permutation.getState('woc:hydration' as any) as number) ?? 0;

    let targetHydration = getAtmosphericHumidity(biome.id, location);
    const risks = getBiomeRisks(biome.id);
    const isRaining = weatherManager.isRaining;
    const isArid = risks.evaporationChance > 0.2;

    let waterBonus = 0;
    const foundWaterSources: Vector3[] = [];

    for (let dx = -WATER_SEARCH_RADIUS; dx <= WATER_SEARCH_RADIUS; dx++) {
        for (let dz = -WATER_SEARCH_RADIUS; dz <= WATER_SEARCH_RADIUS; dz++) {
            if (dx === 0 && dz === 0) continue;
            const checkLoc = { x: location.x + dx, y: location.y, z: location.z + dz };

            try {
                const checkBlock = dimension.getBlock(checkLoc);
                if (checkBlock && checkBlock.typeId === 'minecraft:water') {
                    foundWaterSources.push(checkLoc);
                    if (waterBonus < 4) waterBonus += 2;
                }
            } catch {}
        }
    }
    targetHydration += Math.min(waterBonus, 4);

    const temp = getBiomeTemperature(biome.id, location);
    if (temp > 35) targetHydration -= 2;

    if (isRaining) {
        if (isArid) {
            targetHydration -= 2;
        } else {
            targetHydration += 2;
        }
    }

    targetHydration = Math.max(0, Math.min(MAX_HYDRATION, Math.floor(targetHydration)));

    let newHydration = currentHydration;
    if (isRaining) {
        const rainHitsSoil = Math.random() < risks.rainSensitivity;

        if (rainHitsSoil) {
            if (targetHydration > currentHydration) {
                newHydration++;
            } else if (targetHydration < currentHydration) {
                newHydration--;
            }
        }
    } else {
        if (targetHydration > currentHydration) {
            newHydration++;
        } else if (targetHydration < currentHydration) {
            newHydration--;
        }
    }

    newHydration = Math.max(0, Math.min(MAX_HYDRATION, newHydration));

    let newPerm = block.permutation;
    let hasChanged = false;

    if (newHydration !== currentHydration) {
        newPerm = newPerm.withState('woc:hydration' as any, newHydration);
        hasChanged = true;
    }

    if (hasChanged) {
        block.setPermutation(newPerm);
    }
}

export default {
    id: 'woc:farmland_logic',
    component: FarmlandComponent,
};
