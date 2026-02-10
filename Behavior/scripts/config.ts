import { Vector3 } from '@minecraft/server';
import { BiMap } from './utils/BiMap';

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
    ocean: [8, 15, 0, 0.05, 0, 0.5],
    deep_ocean: [8, 4, 0, 0.05, 0, 0.5],
    warm_ocean: [9, 28, 0, 0.08, 0.02, 0.6],
    lukewarm_ocean: [9, 22, 0, 0.06, 0.01, 0.6],
    deep_lukewarm_ocean: [9, 18, 0, 0.06, 0, 0.5],
    cold_ocean: [7, 8, 0, 0.04, 0, 0.4],
    deep_cold_ocean: [7, 5, 0, 0.04, 0, 0.4],
    frozen_ocean: [5, -2, 0.1, 0, 0, 0.1],
    deep_frozen_ocean: [5, -5, 0.1, 0, 0, 0.1],
    legacy_frozen_ocean: [5, -2, 0.1, 0, 0, 0.1],
    river: [8, 20, 0, 0.04, 0.02, 0.8],
    frozen_river: [4, -5, 0.1, 0, 0, 0.2],

    // --- PLAYAS ---
    beach: [6, 25, 0.05, 0.01, 0, 0.9], // La arena filtra muy rápido
    stone_beach: [5, 15, 0.05, 0.01, 0, 0.1], // La piedra no absorbe
    cold_beach: [4, 5, 0.05, 0.01, 0, 0.5],
    mushroom_island_shore: [10, 18, 0, 0.05, 0.05, 0.8],

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
    roofed_forest: [8, 14, 0, 0.04, 0.06, 0.6],
    roofed_forest_mutated: [8, 14, 0, 0.04, 0.06, 0.6],
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
    cold_taiga: [4, -8, 0.05, 0, 0, 0.2],
    cold_taiga_hills: [4, -10, 0.05, 0, 0, 0.2],
    cold_taiga_mutated: [4, -9, 0.05, 0, 0, 0.2],

    // --- MONTAÑAS Y NIEVE (Poca absorción por suelo congelado/rocoso) ---
    extreme_hills: [3, 5, 0.1, 0, 0, 0.2],
    extreme_hills_edge: [3, 8, 0.1, 0, 0, 0.2],
    extreme_hills_mutated: [3, 5, 0.1, 0, 0, 0.2],
    extreme_hills_plus_trees: [4, 5, 0.1, 0, 0.01, 0.2],
    extreme_hills_plus_trees_mutated: [4, 5, 0.1, 0, 0.01, 0.2],
    meadow: [5, 10, 0.05, 0.01, 0.03, 0.4],
    grove: [3, -2, 0.1, 0, 0, 0.1],
    snowy_slopes: [2, -10, 0.15, 0, 0, 0.1],
    jagged_peaks: [1, -18, 0.2, 0, 0, 0],
    frozen_peaks: [0, -25, 0.25, 0, 0, 0],
    stony_peaks: [2, 8, 0.1, 0, 0, 0.1],
    ice_plains: [2, -15, 0.1, 0, 0, 0.1],
    ice_plains_spikes: [1, -20, 0.1, 0, 0, 0],
    ice_mountains: [1, -18, 0.15, 0, 0, 0],

    // --- ÁRIDOS (Alta sensibilidad para DISIPAR agua) ---
    desert: [0, 45, 0.4, 0, 0, 0.9],
    desert_hills: [0, 42, 0.4, 0, 0, 0.9],
    desert_mutated: [0, 45, 0.4, 0, 0, 0.9],
    mesa: [0, 40, 0.3, 0, 0, 0.8],
    mesa_bryce: [0, 38, 0.3, 0, 0, 0.8],
    mesa_plateau: [0, 38, 0.3, 0, 0, 0.8],
    mesa_plateau_mutated: [0, 38, 0.3, 0, 0, 0.8],
    mesa_plateau_stone: [0, 36, 0.3, 0, 0, 0.5],
    mesa_plateau_stone_mutated: [0, 36, 0.3, 0, 0, 0.5],
    savanna: [2, 35, 0.2, 0, 0.01, 0.7],
    savanna_mutated: [2, 35, 0.2, 0, 0.01, 0.7],
    savanna_plateau: [1, 30, 0.2, 0, 0.01, 0.7],
    savanna_plateau_mutated: [1, 30, 0.2, 0, 0.01, 0.7],

    // --- HÚMEDOS (Alta sensibilidad para RETENER agua) ---
    jungle: [9, 30, 0, 0.03, 0.12, 0.8],
    jungle_hills: [9, 28, 0, 0.03, 0.1, 0.8],
    jungle_mutated: [9, 30, 0, 0.03, 0.12, 0.8],
    jungle_edge: [8, 28, 0, 0.02, 0.08, 0.7],
    jungle_edge_mutated: [8, 28, 0, 0.02, 0.08, 0.7],
    bamboo_jungle: [9, 29, 0, 0.02, 0.15, 0.8],
    bamboo_jungle_hills: [9, 27, 0, 0.02, 0.12, 0.8],
    swampland: [9, 24, 0, 0.08, 0.04, 1.0], // Máxima retención
    swampland_mutated: [9, 24, 0, 0.08, 0.04, 1.0],
    mangrove_swamp: [10, 28, 0, 0.1, 0.05, 1.0],
    mushroom_island: [10, 20, 0, 0.05, 0.08, 0.9],

    // --- NETHER (Inhabitable - Lluvia irrelevante pero configurado) ---
    hell: [0, 120, 1.0, 0, 0, 0],
    crimson_forest: [0, 100, 0.9, 0, 0.05, 0],
    warped_forest: [0, 85, 0.8, 0, 0.05, 0],
    soulsand_valley: [0, 60, 0.7, 0, 0, 0],
    basalt_deltas: [0, 180, 1.0, 0, 0, 0],

    // --- END ---
    the_end: [0, -80, 0.5, 0, 0, 0],
};

export const FOOD_MAP = new BiMap({
    // Cultivos básicos
    'minecraft:apple': 0,
    'minecraft:golden_apple': 1,
    'minecraft:enchanted_golden_apple': 2,
    'minecraft:potato': 3,
    'minecraft:baked_potato': 4,
    'minecraft:poisonous_potato': 5,
    'minecraft:carrot': 6,
    'minecraft:golden_carrot': 7,
    'minecraft:beetroot': 8,
    'minecraft:bread': 9,

    // Carnes crudas
    'minecraft:beef': 10,
    'minecraft:porkchop': 11,
    'minecraft:chicken': 12,
    'minecraft:mutton': 13,
    'minecraft:rabbit': 14,
    'minecraft:cod': 15,
    'minecraft:salmon': 16,
    'minecraft:tropical_fish': 17,
    'minecraft:pufferfish': 18,
    'minecraft:rotten_flesh': 19,

    // Carnes cocinadas
    'minecraft:cooked_beef': 20,
    'minecraft:cooked_porkchop': 21,
    'minecraft:cooked_chicken': 22,
    'minecraft:cooked_mutton': 23,
    'minecraft:cooked_rabbit': 24,
    'minecraft:cooked_cod': 25,
    'minecraft:cooked_salmon': 26,

    // Preparados / varios
    'minecraft:cookie': 27,
    'minecraft:cake': 28,
    'minecraft:pumpkin_pie': 29,
    'minecraft:rabbit_stew': 30,
    'minecraft:beetroot_soup': 31,
    'minecraft:mushroom_stew': 32,
    'minecraft:suspicious_stew': 33,

    // Otros comestibles
    'minecraft:chorus_fruit': 34,
    'minecraft:dried_kelp': 35,
    'minecraft:honey_bottle': 36,
    'minecraft:melon_slice': 37,
    'minecraft:sweet_berries': 38,
    'minecraft:glow_berries': 39,

    // Otros cultivos
    'woc:carrot': 40,
    'woc:potato': 41,
    'woc:onion': 42,
    'woc:tomato': 43,
    'woc:cabbage': 44,
    'woc:rice': 45,
    'minecraft:milk_bucket': 46,
    'woc:cabbage_rolls': 47,
    'woc:cabbage_leaf': 48,
    'woc:wheat_dough': 49,
    'woc:dumplings': 50,
    'woc:fried_egg': 51,
    'woc:egg_sandwich': 52,
    'woc:chicken_sandwich': 53,
    'woc:bacon': 54,
    'woc:cooked_bacon': 55,
    'woc:bacon_sandwich': 56,

    // Bowl foods (comidas con cuenco)
    'woc:bacon_and_eggs': 57,
    'woc:baked_cod_stew': 58,
    'woc:beef_stew': 59,
    'woc:bone_broth': 60,
    'woc:chicken_soup': 61,
    'woc:cooked_rice': 62,
    'woc:fish_stew': 63,
    'woc:fried_rice': 64,
    'woc:mixed_salad': 65,
    'woc:pumpkin_soup': 66,
    'woc:tomato_sauce': 67,
    'woc:mushroom_rice': 68,
    'woc:steak_and_potatoes': 69,
    'woc:vegetable_soup': 70,
    'woc:milk_bottle': 71,
});

// [frutas, proteinas, vegetales, granos, azúcares, lácteos, grasas]
export type Nutrition = [number, number, number, number, number, number, number];

// Regla de balance: ningún alimento supera 0.10 en una categoría.
// Suma total de todas las categorías por alimento ≤ 0.15.
// Alimentos simples (1 ingrediente): 0.02–0.04 principal, total ~0.03–0.05.
// Preparados (multi-ingrediente): hasta 0.08 principal, total ~0.08–0.15.
// Grasas siempre mínimas (0.003–0.01) — la más difícil de subir y la más lenta en bajar.
// [frutas, proteinas, vegetales, granos, azúcares, lácteos, grasas]
const foodPropertiesData: Record<number, Nutrition> = {
    // === FRUTAS SIMPLES === (total ~0.03–0.05)
    0: [0.03, 0, 0, 0, 0.01, 0, 0], // apple
    34: [0.03, 0, 0, 0, 0.005, 0, 0], // chorus_fruit
    37: [0.03, 0, 0, 0, 0.01, 0, 0], // melon_slice
    38: [0.02, 0, 0, 0, 0.005, 0, 0], // sweet_berries
    39: [0.03, 0, 0, 0, 0.01, 0, 0], // glow_berries

    // === GOLDEN / ENCHANTED ===
    1: [0.03, 0, 0, 0, 0.01, 0, 0], // golden_apple (oro inerte = apple)
    2: [0.1, 0.06, 0.06, 0.06, 0.1, 0.06, 0.01], // enchanted (divina, total=0.45 excepción única)

    // === VEGETALES SIMPLES === (total ~0.03–0.05)
    3: [0, 0, 0.03, 0.005, 0, 0, 0], // potato cruda
    4: [0, 0, 0.04, 0.02, 0, 0, 0], // baked_potato
    5: [0, 0, 0.005, 0, 0, 0, 0], // poisonous_potato
    6: [0, 0, 0.04, 0, 0.005, 0, 0], // carrot
    7: [0, 0, 0.04, 0, 0.005, 0, 0], // golden_carrot (oro inerte)
    8: [0, 0, 0.04, 0, 0, 0, 0], // beetroot
    35: [0, 0.005, 0.02, 0, 0, 0, 0], // dried_kelp

    // WoC vegetales (total ~0.03–0.05)
    40: [0, 0, 0.04, 0, 0.005, 0, 0], // woc:carrot
    41: [0, 0, 0.03, 0.005, 0, 0, 0], // woc:potato
    42: [0, 0, 0.04, 0, 0, 0, 0], // woc:onion
    43: [0.02, 0, 0.02, 0, 0.005, 0, 0], // woc:tomato
    44: [0, 0, 0.04, 0, 0, 0, 0], // woc:cabbage

    // === GRANOS SIMPLES === (total ~0.03–0.04)
    9: [0, 0, 0, 0.04, 0, 0, 0], // bread
    45: [0, 0, 0, 0.035, 0, 0, 0], // woc:rice

    // === PROTEÍNAS CRUDAS === (total ~0.025–0.04, riesgo)
    10: [0, 0.03, 0, 0, 0, 0, 0.005], // beef crudo
    11: [0, 0.025, 0, 0, 0, 0, 0.008], // porkchop crudo
    12: [0, 0.02, 0, 0, 0, 0, 0.005], // chicken crudo
    13: [0, 0.03, 0, 0, 0, 0, 0.005], // mutton
    14: [0, 0.025, 0, 0, 0, 0, 0], // rabbit
    15: [0, 0.025, 0, 0, 0, 0, 0], // cod
    16: [0, 0.025, 0, 0, 0, 0, 0.005], // salmon
    17: [0, 0.015, 0, 0, 0, 0, 0], // tropical_fish
    19: [0, 0.008, 0, 0, 0, 0, 0.003], // rotten_flesh

    // === PROTEÍNAS COCINADAS === (total ~0.04–0.06)
    20: [0, 0.05, 0, 0, 0, 0, 0.008], // cooked_beef
    21: [0, 0.04, 0, 0, 0, 0, 0.01], // cooked_porkchop
    22: [0, 0.04, 0, 0, 0, 0, 0.005], // cooked_chicken
    23: [0, 0.04, 0, 0, 0, 0, 0.008], // cooked_mutton
    24: [0, 0.04, 0, 0, 0, 0, 0.003], // cooked_rabbit (magra)
    25: [0, 0.035, 0, 0, 0, 0, 0], // cooked_cod
    26: [0, 0.04, 0, 0, 0, 0, 0.008], // cooked_salmon

    // === PREPARADOS SIMPLES === (total ~0.05–0.10)
    27: [0, 0, 0, 0.02, 0.03, 0, 0.005], // cookie (total=0.055)
    28: [0.02, 0.01, 0, 0.04, 0.05, 0.02, 0.01], // cake porción (total=0.15)
    29: [0.02, 0, 0.03, 0.03, 0.04, 0.01, 0.008], // pumpkin_pie (total=0.138)

    // === ESTOFADOS === (total ~0.10–0.15, recompensa por elaborar)
    30: [0, 0.06, 0.05, 0.01, 0, 0, 0.008], // rabbit_stew (total=0.128)
    31: [0, 0, 0.08, 0, 0, 0, 0], // beetroot_soup (total=0.08)
    32: [0, 0.01, 0.06, 0, 0, 0, 0], // mushroom_stew (total=0.07)
    33: [0, 0.01, 0.05, 0, 0, 0, 0], // suspicious_stew (total=0.06)

    // === WoC ITEMS INDIVIDUALES === (total ~0.03–0.06)
    46: [0, 0, 0, 0, 0, 0.03, 0], // milk_bucket
    47: [0, 0.005, 0.03, 0, 0.003, 0, 0], // cabbage_rolls (total=0.038)
    48: [0, 0, 0.015, 0, 0, 0, 0], // cabbage_leaf
    49: [0, 0, 0, 0.03, 0, 0, 0], // wheat_dough
    50: [0, 0.04, 0.04, 0.03, 0, 0, 0], // dumplings (total=0.11)
    51: [0, 0.035, 0, 0, 0, 0, 0.003], // fried_egg (total=0.038)
    52: [0, 0.04, 0, 0.04, 0, 0, 0.003], // egg_sandwich (total=0.083)
    53: [0.005, 0.04, 0.01, 0.03, 0, 0, 0.003], // chicken_sandwich (total=0.088)
    54: [0, 0.015, 0, 0, 0, 0, 0.008], // bacon crudo (total=0.023)
    55: [0, 0.03, 0, 0, 0, 0, 0.008], // cooked_bacon (total=0.038)
    56: [0.005, 0.05, 0.01, 0.04, 0, 0, 0.005], // bacon_sandwich (total=0.11)

    // === BOWL FOODS === (total ~0.08–0.15, recompensa máxima)
    // [frutas, proteinas, vegetales, granos, azúcares, lácteos, grasas]
    57: [0, 0.06, 0, 0, 0, 0, 0.01], // bacon_and_eggs (total=0.07)
    58: [0, 0.05, 0.04, 0.02, 0, 0, 0.005], // baked_cod_stew (total=0.115)
    59: [0, 0.07, 0.04, 0.02, 0, 0, 0.01], // beef_stew (total=0.14)
    60: [0, 0.03, 0.015, 0, 0, 0, 0.005], // bone_broth (total=0.05)
    61: [0, 0.06, 0.03, 0, 0, 0, 0.008], // chicken_soup (total=0.098)
    62: [0, 0, 0, 0.06, 0, 0, 0], // cooked_rice (total=0.06)
    63: [0, 0.06, 0.03, 0, 0, 0, 0.008], // fish_stew (total=0.098)
    64: [0, 0.02, 0.02, 0.05, 0, 0, 0.005], // fried_rice (total=0.095)
    65: [0.02, 0, 0.07, 0, 0.005, 0, 0], // mixed_salad (total=0.095)
    66: [0, 0, 0.04, 0.03, 0.01, 0, 0], // pumpkin_soup (total=0.08)
    67: [0.03, 0, 0.04, 0, 0.005, 0, 0], // tomato_sauce (total=0.075)
    68: [0, 0.008, 0.02, 0.05, 0, 0, 0.003], // mushroom_rice (total=0.081)
    69: [0, 0.07, 0.02, 0.03, 0, 0, 0.01], // steak_and_potatoes (total=0.13)
    70: [0, 0, 0.07, 0, 0, 0, 0], // vegetable_soup (total=0.07)
    71: [0, 0, 0, 0, 0, 0.008, 0], // milk_bottle (total=0.008)
};
export const FOOD_PROPERTIES: Map<number, Nutrition> = new Map(
    Object.entries(foodPropertiesData).map(([k, v]) => [+k, v]),
);

// ============================================================================
// CONFIGURACIÓN METABÓLICA
// ============================================================================

// Ticks totales en un día de Minecraft = 24000 (20 minutos)
// Si queremos que la barra baje del 100% al 0% en 3 días de juego (Survival Hardcore):
// 24000 * 3 = 72000 ticks.
// 1.0 / 72000 = ~0.0000138 por tick.

export const METABOLISM = {
    // Cuánto baja la nutrición por tick en condiciones perfectas (20°C, quieto)
    // Valor calibrado para que mantener buffs requiera alimentación constante y variada
    BASE_BURN_PER_TICK: 0.0000025,

    // Temperatura ideal del cuerpo (Zona de confort)
    IDEAL_TEMP_MIN: 15,
    IDEAL_TEMP_MAX: 25,

    // Penalización por frío (Tiritar gasta MUCHA energía)
    COLD_PENALTY_FACTOR: 0.02, // +2% de consumo por cada grado bajo el mínimo

    // Penalización por calor (Sudar gasta energía, pero menos que el frío)
    HEAT_PENALTY_FACTOR: 0.01, // +1% de consumo por cada grado sobre el máximo
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
        rainSensitivity: data[5],
    };
}

export const ADDON = {
    // Agriculture Update I
    enableBetterFarming: true,

    // Agriculture Update II
    enableDiet: true,
    enableBiomeDietImpact: true,
    enableArmorDietImpact: true,
    enablePhysicalActivityDietImpact: true,
    enableDietDebuffs: false,
};
