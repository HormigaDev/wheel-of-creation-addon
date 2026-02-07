import {
    Player,
    EquipmentSlot,
    EntityComponentTypes,
    EntityEquippableComponent,
} from '@minecraft/server';

export interface ThermalStats {
    insulation: number; // Protección contra el frío (0.0 a 1.0+)
    conductivity: number; // Penalización por calor (0.0 a 1.0+)
}

const MATERIAL_STATS: Record<string, ThermalStats> = {
    leather: { insulation: 0.2, conductivity: 0.02 },
    chainmail: { insulation: 0.05, conductivity: 0.05 },
    iron: { insulation: 0.02, conductivity: 0.1 },
    golden: { insulation: 0.0, conductivity: 0.12 },
    diamond: { insulation: 0.05, conductivity: 0.08 },
    netherite: { insulation: 0.08, conductivity: 0.03 },
    turtle: { insulation: 0.05, conductivity: 0.0 },
};

export function getPlayerThermalStats(player: Player): ThermalStats {
    let total = { insulation: 0, conductivity: 0 };

    const equipment = player.getComponent(
        EntityComponentTypes.Equippable,
    ) as EntityEquippableComponent;
    if (!equipment) return total;

    const slots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];

    for (const slot of slots) {
        const item = equipment.getEquipment(slot);
        if (!item) continue;

        const itemId = item.typeId;

        for (const [material, stats] of Object.entries(MATERIAL_STATS)) {
            if (itemId.includes(material)) {
                total.insulation += stats.insulation;
                total.conductivity += stats.conductivity;
                break;
            }
        }
    }

    return total;
}
