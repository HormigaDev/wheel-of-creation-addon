import {
    Player,
    EquipmentSlot,
    EntityComponentTypes,
    EntityEquippableComponent,
} from '@minecraft/server';

export interface ThermalStats {
    insulation: number;
    conductivity: number;
}

const ARMOR_SLOTS = [
    EquipmentSlot.Head,
    EquipmentSlot.Chest,
    EquipmentSlot.Legs,
    EquipmentSlot.Feet,
];

const ARMOR_DB: Record<string, ThermalStats> = {
    // Leather
    'minecraft:leather_helmet': { insulation: 0.2, conductivity: 0.02 },
    'minecraft:leather_chestplate': { insulation: 0.2, conductivity: 0.02 },
    'minecraft:leather_leggings': { insulation: 0.2, conductivity: 0.02 },
    'minecraft:leather_boots': { insulation: 0.2, conductivity: 0.02 },

    // Chainmail
    'minecraft:chainmail_helmet': { insulation: 0.05, conductivity: 0.05 },
    'minecraft:chainmail_chestplate': { insulation: 0.05, conductivity: 0.05 },
    'minecraft:chainmail_leggings': { insulation: 0.05, conductivity: 0.05 },
    'minecraft:chainmail_boots': { insulation: 0.05, conductivity: 0.05 },

    // Iron
    'minecraft:iron_helmet': { insulation: 0.02, conductivity: 0.1 },
    'minecraft:iron_chestplate': { insulation: 0.02, conductivity: 0.1 },
    'minecraft:iron_leggings': { insulation: 0.02, conductivity: 0.1 },
    'minecraft:iron_boots': { insulation: 0.02, conductivity: 0.1 },

    // Golden
    'minecraft:golden_helmet': { insulation: 0.0, conductivity: 0.12 },
    'minecraft:golden_chestplate': { insulation: 0.0, conductivity: 0.12 },
    'minecraft:golden_leggings': { insulation: 0.0, conductivity: 0.12 },
    'minecraft:golden_boots': { insulation: 0.0, conductivity: 0.12 },

    // Diamond
    'minecraft:diamond_helmet': { insulation: 0.05, conductivity: 0.08 },
    'minecraft:diamond_chestplate': { insulation: 0.05, conductivity: 0.08 },
    'minecraft:diamond_leggings': { insulation: 0.05, conductivity: 0.08 },
    'minecraft:diamond_boots': { insulation: 0.05, conductivity: 0.08 },

    // Netherite
    'minecraft:netherite_helmet': { insulation: 0.08, conductivity: 0.03 },
    'minecraft:netherite_chestplate': { insulation: 0.08, conductivity: 0.03 },
    'minecraft:netherite_leggings': { insulation: 0.08, conductivity: 0.03 },
    'minecraft:netherite_boots': { insulation: 0.08, conductivity: 0.03 },

    // Turtle
    'minecraft:turtle_helmet': { insulation: 0.05, conductivity: 0.0 },
};

const ZERO_STATS: ThermalStats = { insulation: 0, conductivity: 0 };

export function getPlayerThermalStats(player: Player): ThermalStats {
    if (!player.isValid) return ZERO_STATS;

    const equipment = player.getComponent(
        EntityComponentTypes.Equippable,
    ) as EntityEquippableComponent;
    if (!equipment) return ZERO_STATS;

    let totalInsulation = 0;
    let totalConductivity = 0;

    for (const slot of ARMOR_SLOTS) {
        const item = equipment.getEquipment(slot);
        if (!item) continue;

        const stats = ARMOR_DB[item.typeId];

        if (stats) {
            totalInsulation += stats.insulation;
            totalConductivity += stats.conductivity;
        }
    }

    return { insulation: totalInsulation, conductivity: totalConductivity };
}
