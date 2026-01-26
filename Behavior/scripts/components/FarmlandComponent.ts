import { Block, BlockCustomComponent, EquipmentSlot, GameMode } from '@minecraft/server';

const SEA_LEVEL = 64;
const MAX_HYDRATION = 10;
const MAX_FERTILIZER = 10;
const WATER_SEARCH_RADIUS = 3;

const FarmlandComponent: BlockCustomComponent = {
    onRandomTick(e) {
        updateHydration(e.block);
    },
    onPlace(e) {
        updateHydration(e.block);
    },
    onPlayerInteract(e) {
        const { block, player } = e;
        if (!player) return;

        const equipment = player.getComponent('minecraft:equippable');
        if (!equipment) return;
        const mainHandItem = equipment.getEquipment(EquipmentSlot.Mainhand);

        if (mainHandItem && mainHandItem.typeId === 'woc:fertilizer') {
            const currentFertilizer: number =
                block.permutation.getState('woc:fertilizer_level' as any) ?? 0;

            if (currentFertilizer < MAX_FERTILIZER) {
                const newLevel = currentFertilizer + 1;
                block.setPermutation(
                    block.permutation.withState('woc:fertilizer_level' as any, newLevel),
                );
                block.dimension.playSound('item.bone_meal.use', block.location);

                if (player.getGameMode() !== GameMode.Creative) {
                    if (mainHandItem.amount > 1) {
                        mainHandItem.amount -= 1;
                        equipment.setEquipment(EquipmentSlot.Mainhand, mainHandItem);
                    } else {
                        equipment.setEquipment(EquipmentSlot.Mainhand, undefined);
                    }
                }
            }
        }
    },
};

function updateHydration(block: Block) {
    const y = block.location.y;
    const dimension = block.dimension;
    let baseHydration = 5 - Math.floor((y - SEA_LEVEL) / 10);

    if (baseHydration < 0) baseHydration = 0;
    if (baseHydration > 10) baseHydration = 10;

    let waterBonus = 0;
    let foundEnoughWater = false;

    for (let dx = -WATER_SEARCH_RADIUS; dx <= WATER_SEARCH_RADIUS; dx++) {
        for (let dz = -WATER_SEARCH_RADIUS; dz <= WATER_SEARCH_RADIUS; dz++) {
            const checkBlock = dimension.getBlock({
                x: block.location.x + dx,
                y: block.location.y,
                z: block.location.z + dz,
            });

            if (
                checkBlock &&
                ['minecraft:water', 'minecraft:flowing_water'].includes(checkBlock.typeId)
            ) {
                waterBonus += 2;
                if (baseHydration + waterBonus >= MAX_HYDRATION) {
                    foundEnoughWater = true;
                    break;
                }
            }
        }
        if (foundEnoughWater) break;
    }

    let finalHydration = baseHydration + waterBonus;
    if (finalHydration > MAX_HYDRATION) finalHydration = MAX_HYDRATION;

    const currentHydration: number = block.permutation.getState('woc:hydration' as any) ?? 0;

    if (currentHydration !== finalHydration) {
        block.setPermutation(block.permutation.withState('woc:hydration' as any, finalHydration));
    }
}

export default {
    id: 'woc:farmland_logic',
    component: FarmlandComponent,
};
