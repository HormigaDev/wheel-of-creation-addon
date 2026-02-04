import { Player, Block, GameMode, EquipmentSlot } from '@minecraft/server';

/**
 * Verifica si hay una fuente de agua adyacente al bloque
 */
export function hasAdjacentWater(block: Block): boolean {
    const directions = [
        { x: 1, z: 0 },
        { x: -1, z: 0 },
        { x: 0, z: 1 },
        { x: 0, z: -1 },
    ];

    for (const dir of directions) {
        const neighbor = block.offset({ x: dir.x, y: 0, z: dir.z });
        if (!neighbor) continue;

        const isWater =
            neighbor.typeId === 'minecraft:water' || neighbor.typeId === 'minecraft:flowing_water';

        if (isWater || neighbor.isWaterlogged) {
            return true;
        }
    }

    return false;
}

/**
 * Consume un item de la mano del jugador (si no está en creativo)
 */
export function consumeItemInHand(player: Player): void {
    if (player.getGameMode() === GameMode.Creative) return;

    const equipment = player.getComponent('minecraft:equippable');
    const currentItem = equipment?.getEquipment(EquipmentSlot.Mainhand);

    if (!currentItem) return;

    if (currentItem.amount > 1) {
        currentItem.amount -= 1;
        equipment?.setEquipment(EquipmentSlot.Mainhand, currentItem);
    } else {
        equipment?.setEquipment(EquipmentSlot.Mainhand, undefined);
    }
}

/**
 * Aplica daño a la herramienta en mano del jugador
 */
export function damageHeldTool(player: Player): void {
    if (player.getGameMode() === GameMode.Creative) return;

    const equipment = player.getComponent('minecraft:equippable');
    const tool = equipment?.getEquipment(EquipmentSlot.Mainhand);

    if (!tool) return;

    const durability = tool.getComponent('minecraft:durability');
    if (!durability) return;

    durability.damage += 1;

    if (durability.damage >= durability.maxDurability) {
        player.dimension.playSound('random.break', player.location);
        equipment?.setEquipment(EquipmentSlot.Mainhand, undefined);
    } else {
        equipment?.setEquipment(EquipmentSlot.Mainhand, tool);
    }
}

/**
 * Obtiene el nivel de hidratación de un bloque de farmland
 */
export function getFarmlandHydration(block: Block): number {
    if (block.typeId !== 'woc:farmland') return 0;
    return (block.permutation.getState('woc:hydration' as any) as number) ?? 0;
}

/**
 * Obtiene el nivel de fertilizante de un bloque de farmland
 */
export function getFarmlandFertilizer(block: Block): number {
    if (block.typeId !== 'woc:farmland') return 0;
    return (block.permutation.getState('woc:fertilizer_level' as any) as number) ?? 0;
}
