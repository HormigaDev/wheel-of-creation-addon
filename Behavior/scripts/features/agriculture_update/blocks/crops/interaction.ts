import {
    Player,
    GameMode,
    EquipmentSlot,
    EntityEquippableComponent,
    ItemStack,
    Block,
} from '@minecraft/server';
import { CREATIVE_FERTILIZER_ID } from './constants';

/**
 * Resultado de verificar si el jugador tiene fertilizante creativo
 */
export interface CreativeFertilizerCheck {
    hasItem: boolean;
    equipment?: EntityEquippableComponent;
    itemStack?: ItemStack;
}

/**
 * Verifica si el jugador tiene fertilizante creativo en la mano
 */
export function checkCreativeFertilizer(player: Player | undefined): CreativeFertilizerCheck {
    if (!player) return { hasItem: false };

    const equipment = player.getComponent('minecraft:equippable') as EntityEquippableComponent;
    if (!equipment) return { hasItem: false };

    const itemStack = equipment.getEquipment(EquipmentSlot.Mainhand);
    if (!itemStack || itemStack.typeId !== CREATIVE_FERTILIZER_ID) {
        return { hasItem: false };
    }

    return { hasItem: true, equipment, itemStack };
}

/**
 * Consume un item de la mano del jugador (si no está en creativo)
 */
export function consumeHeldItem(
    player: Player,
    equipment: EntityEquippableComponent,
    itemStack: ItemStack,
): void {
    if (player.getGameMode() === GameMode.Creative) return;

    if (itemStack.amount > 1) {
        itemStack.amount--;
        equipment.setEquipment(EquipmentSlot.Mainhand, itemStack);
    } else {
        equipment.setEquipment(EquipmentSlot.Mainhand, undefined);
    }
}

/**
 * Reproduce efectos visuales y sonoros de fertilización
 */
export function playFertilizeEffects(block: Block): void {
    block.dimension.playSound('item.bone_meal.use', block.location);
    block.dimension.spawnParticle('minecraft:crop_growth_emitter', block.center());
}

/**
 * Maneja la interacción con fertilizante creativo de forma genérica
 * Retorna true si se aplicó el fertilizante
 */
export function handleCreativeFertilizerInteraction(
    player: Player | undefined,
    block: Block,
    applyEffect: () => boolean,
): boolean {
    const check = checkCreativeFertilizer(player);
    if (!check.hasItem || !check.equipment || !check.itemStack) return false;

    const applied = applyEffect();

    if (applied) {
        playFertilizeEffects(block);
        consumeHeldItem(player!, check.equipment, check.itemStack);
    }

    return applied;
}
