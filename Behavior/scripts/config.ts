import { Vector3 } from '@minecraft/server';

// ============================================================================
// CONFIGURACIÓN CENTRALIZADA DE BIOMAS
// Estructura del Array:
// [0] Humedad Base (0-10)
// [1] Temperatura Base (°C)
// [2] Factor Evaporación (0.0 - 1.0) -> Probabilidad extra de secarse
// [3] Factor Podredumbre (0.0 - 1.0) -> Probabilidad de honguearse
// [4] Chance Maleza (0.0 - 1.0)      -> Probabilidad de hierba parásita
// [5] Sensibilidad Lluvia (0.0 - 1.0)-> Probabilidad de afectar la hidratación (+/-)
// ============================================================================

export type BiomeData = [number, number, number, number, number, number];

const DEFAULT_BIOME_DATA: BiomeData = [5, 20, 0.01, 0.01, 0.05, 0.3];

const BIOME_REGISTRY: Record<string, BiomeData> = {
    // --- OCÉANOS Y RÍOS ---
    ocean: [8, 15, 0.0, 0.05, 0.0, 0.5],
    deep_ocean: [8, 4, 0.0, 0.05, 0.0, 0.5],
    warm_ocean: [9, 28, 0.0, 0.08, 0.02, 0.6],
    lukewarm_ocean: [9, 22, 0.0, 0.06, 0.01, 0.6],
    deep_lukewarm_ocean: [9, 18, 0.0, 0.06, 0.0, 0.5],
    cold_ocean: [7, 8, 0.0, 0.04, 0.0, 0.4],
    deep_cold_ocean: [7, 5, 0.0, 0.04, 0.0, 0.4],
    frozen_ocean: [5, -2, 0.1, 0.0, 0.0, 0.1],
    deep_frozen_ocean: [5, -5, 0.1, 0.0, 0.0, 0.1],
    legacy_frozen_ocean: [5, -2, 0.1, 0.0, 0.0, 0.1],
    river: [8, 20, 0.0, 0.04, 0.02, 0.8],
    frozen_river: [4, -5, 0.1, 0.0, 0.0, 0.2],

    // --- PLAYAS ---
    beach: [6, 25, 0.05, 0.01, 0.0, 0.9], // La arena filtra muy rápido
    stone_beach: [5, 15, 0.05, 0.01, 0.0, 0.1], // La piedra no absorbe
    cold_beach: [4, 5, 0.05, 0.01, 0.0, 0.5],
    mushroom_island_shore: [10, 18, 0.0, 0.05, 0.05, 0.8],

    // --- LLANURAS Y BOSQUES ---
    plains: [5, 18, 0.02, 0.01, 0.05, 0.4],
    sunflower_plains: [5, 19, 0.02, 0.01, 0.03, 0.4],
    forest: [6, 15, 0.01, 0.02, 0.03, 0.5],
    forest_hills: [6, 14, 0.01, 0.02, 0.03, 0.5],
    flower_forest: [6, 16, 0.01, 0.02, 0.05, 0.5],
    birch_forest: [5, 12, 0.01, 0.01, 0.02, 0.4],
    birch_forest_hills: [5, 11, 0.01, 0.01, 0.02, 0.4],
    birch_forest_mutated: [5, 12, 0.01, 0.01, 0.02, 0.4],
    birch_forest_hills_mutated: [5, 11, 0.01, 0.01, 0.02, 0.4],
    roofed_forest: [8, 14, 0.0, 0.04, 0.06, 0.6],
    roofed_forest_mutated: [8, 14, 0.0, 0.04, 0.06, 0.6],
    cherry_grove: [6, 14, 0.01, 0.01, 0.02, 0.5],
    pale_garden: [5, 13, 0.01, 0.01, 0.01, 0.4],

    // --- TAIGAS ---
    taiga: [6, 5, 0.02, 0.01, 0.02, 0.4],
    taiga_hills: [6, 4, 0.02, 0.01, 0.02, 0.4],
    taiga_mutated: [6, 5, 0.02, 0.01, 0.02, 0.4],
    mega_taiga: [7, 6, 0.01, 0.02, 0.04, 0.6], // Podzol absorbe bien
    mega_taiga_hills: [7, 5, 0.01, 0.02, 0.04, 0.6],
    redwood_taiga_mutated: [7, 6, 0.01, 0.02, 0.04, 0.6],
    redwood_taiga_hills_mutated: [7, 5, 0.01, 0.02, 0.04, 0.6],
    cold_taiga: [4, -8, 0.05, 0.0, 0.0, 0.2],
    cold_taiga_hills: [4, -10, 0.05, 0.0, 0.0, 0.2],
    cold_taiga_mutated: [4, -9, 0.05, 0.0, 0.0, 0.2],

    // --- MONTAÑAS Y NIEVE (Poca absorción por suelo congelado/rocoso) ---
    extreme_hills: [3, 5, 0.1, 0.0, 0.0, 0.2],
    extreme_hills_edge: [3, 8, 0.1, 0.0, 0.0, 0.2],
    extreme_hills_mutated: [3, 5, 0.1, 0.0, 0.0, 0.2],
    extreme_hills_plus_trees: [4, 5, 0.1, 0.0, 0.01, 0.2],
    extreme_hills_plus_trees_mutated: [4, 5, 0.1, 0.0, 0.01, 0.2],
    meadow: [5, 10, 0.05, 0.01, 0.03, 0.4],
    grove: [3, -2, 0.1, 0.0, 0.0, 0.1],
    snowy_slopes: [2, -10, 0.15, 0.0, 0.0, 0.1],
    jagged_peaks: [1, -18, 0.2, 0.0, 0.0, 0.0],
    frozen_peaks: [0, -25, 0.25, 0.0, 0.0, 0.0],
    stony_peaks: [2, 8, 0.1, 0.0, 0.0, 0.1],
    ice_plains: [2, -15, 0.1, 0.0, 0.0, 0.1],
    ice_plains_spikes: [1, -20, 0.1, 0.0, 0.0, 0.0],
    ice_mountains: [1, -18, 0.15, 0.0, 0.0, 0.0],

    // --- ÁRIDOS (Alta sensibilidad para DISIPAR agua) ---
    desert: [0, 45, 0.4, 0.0, 0.0, 0.9],
    desert_hills: [0, 42, 0.4, 0.0, 0.0, 0.9],
    desert_mutated: [0, 45, 0.4, 0.0, 0.0, 0.9],
    mesa: [0, 40, 0.3, 0.0, 0.0, 0.8],
    mesa_bryce: [0, 38, 0.3, 0.0, 0.0, 0.8],
    mesa_plateau: [0, 38, 0.3, 0.0, 0.0, 0.8],
    mesa_plateau_mutated: [0, 38, 0.3, 0.0, 0.0, 0.8],
    mesa_plateau_stone: [0, 36, 0.3, 0.0, 0.0, 0.5],
    mesa_plateau_stone_mutated: [0, 36, 0.3, 0.0, 0.0, 0.5],
    savanna: [2, 35, 0.2, 0.0, 0.01, 0.7],
    savanna_mutated: [2, 35, 0.2, 0.0, 0.01, 0.7],
    savanna_plateau: [1, 30, 0.2, 0.0, 0.01, 0.7],
    savanna_plateau_mutated: [1, 30, 0.2, 0.0, 0.01, 0.7],

    // --- HÚMEDOS (Alta sensibilidad para RETENER agua) ---
    jungle: [9, 30, 0.0, 0.03, 0.12, 0.8],
    jungle_hills: [9, 28, 0.0, 0.03, 0.1, 0.8],
    jungle_mutated: [9, 30, 0.0, 0.03, 0.12, 0.8],
    jungle_edge: [8, 28, 0.0, 0.02, 0.08, 0.7],
    jungle_edge_mutated: [8, 28, 0.0, 0.02, 0.08, 0.7],
    bamboo_jungle: [9, 29, 0.0, 0.02, 0.15, 0.8],
    bamboo_jungle_hills: [9, 27, 0.0, 0.02, 0.12, 0.8],
    swampland: [9, 24, 0.0, 0.08, 0.04, 1.0], // Máxima retención
    swampland_mutated: [9, 24, 0.0, 0.08, 0.04, 1.0],
    mangrove_swamp: [10, 28, 0.0, 0.1, 0.05, 1.0],
    mushroom_island: [10, 20, 0.0, 0.05, 0.08, 0.9],

    // --- NETHER (Inhabitable - Lluvia irrelevante pero configurado) ---
    hell: [0, 120, 1.0, 0.0, 0.0, 0.0],
    crimson_forest: [0, 100, 0.9, 0.0, 0.05, 0.0],
    warped_forest: [0, 85, 0.8, 0.0, 0.05, 0.0],
    soulsand_valley: [0, 60, 0.7, 0.0, 0.0, 0.0],
    basalt_deltas: [0, 180, 1.0, 0.0, 0.0, 0.0],

    // --- END ---
    the_end: [0, -80, 0.5, 0.0, 0.0, 0.0],
};

function normalizeBiomeId(fullId: string): string {
    return fullId.startsWith('minecraft:') ? fullId.substring(10) : fullId;
}

function getBiomeData(biomeId: string): BiomeData {
    const shortId = normalizeBiomeId(biomeId);
    return BIOME_REGISTRY[shortId] ?? DEFAULT_BIOME_DATA;
}

export function getAtmosphericHumidity(biomeId: string, location: Vector3): number {
    const data = getBiomeData(biomeId);
    let humidity = data[0];
    if (humidity === 0) return 0;
    const y = location.y;
    if (y > 80) humidity -= (y - 80) / 40;
    if (y < 50) humidity += 2;
    return Math.max(0, Math.min(10, Math.floor(humidity)));
}

export function getBiomeTemperature(biomeId: string, location?: Vector3): number {
    const shortId = normalizeBiomeId(biomeId);
    const data = getBiomeData(biomeId);
    let temp = data[1];
    if (!location) return temp;
    const isNether = ['hell', 'crimson', 'warped', 'soulsand', 'basalt'].some((t) =>
        shortId.includes(t),
    );
    if (isNether || shortId === 'the_end') return temp;
    const y = location.y;
    if (y < 40 && temp > -50 && temp < 100) return parseFloat(((temp + 15) / 2).toFixed(1));
    if (y > 90) temp -= (y - 90) / 10;
    return parseFloat(temp.toFixed(1));
}

export function getBiomeRisks(biomeId: string) {
    const data = getBiomeData(biomeId);
    return {
        evaporationChance: data[2],
        rotChance: data[3],
        weedChance: data[4],
        rainSensitivity: data[5], // NUEVO DATO
    };
}
