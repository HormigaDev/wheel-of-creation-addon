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

const foodPropertiesData: Record<number, Nutrition> = {
    // FRUTAS (50g = Media Manzana / Puñado de bayas)
    // Aporte rápido de azúcar y vitaminas.
    0: [0.2, 0, 0, 0, 0.1, 0, 0], // apple (20% fruta + azúcar)
    34: [0.15, 0, 0, 0, 0.05, 0, 0], // chorus_fruit
    37: [0.15, 0, 0, 0, 0.1, 0, 0], // melon_slice (Mucha agua)
    38: [0.1, 0, 0, 0, 0.05, 0, 0], // sweet_berries
    39: [0.15, 0, 0, 0, 0.1, 0, 0], // glow_berries

    // Golden (INERTE) / Enchanted (SAGRADO)
    // Regla Oro Inerte: Golden Apple = Apple (50g)
    1: [0.2, 0, 0, 0, 0.1, 0, 0], // golden_apple
    2: [1.0, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5], // enchanted_golden_apple (Sigue siendo divina)

    // VEGETALES (50g = Una Papa/Zanahoria mediana)
    // Nutrición sólida. La base de la supervivencia.
    3: [0, 0, 0.15, 0.05, 0, 0, 0], // potato (Cruda)
    4: [0, 0, 0.25, 0.15, 0, 0, 0], // baked_potato (25% Veg + Energía - Muy buena)
    5: [0, 0, 0.05, 0, 0, 0, 0], // poisonous_potato
    6: [0, 0, 0.2, 0, 0.05, 0, 0], // carrot (20% Veg + Azúcar)
    7: [0, 0, 0.2, 0, 0.05, 0, 0], // golden_carrot (Igual a carrot #6 - ORO INERTE)
    8: [0, 0, 0.2, 0, 0, 0, 0], // beetroot
    35: [0, 0.05, 0.1, 0, 0, 0, 0], // dried_kelp

    // WoC vegetales
    40: [0, 0, 0.2, 0, 0.05, 0, 0], // woc:carrot
    41: [0, 0, 0.15, 0.05, 0, 0, 0], // woc:potato
    42: [0, 0, 0.2, 0, 0, 0, 0], // woc:onion
    43: [0.15, 0, 0.1, 0, 0.05, 0, 0], // woc:tomato
    44: [0, 0, 0.25, 0, 0, 0, 0], // woc:cabbage (Nutritiva)

    // GRANOS (50g = Un bolillo/panecillo)
    // El pan es denso. 50g de pan llenan bastante.
    9: [0, 0, 0, 0.25, 0, 0, 0], // bread (25% Grano - Comes 4 y estás lleno)
    45: [0, 0, 0, 0.2, 0, 0, 0], // woc:rice

    // PROTEÍNAS (50g = Un filete pequeño / Una chuleta)
    // La carne es densa. Aporta mucha saciedad.
    10: [0, 0.15, 0, 0, 0, 0, 0.05], // beef (Crudo - Riesgo)
    11: [0, 0.15, 0, 0, 0, 0, 0.1], // porkchop (Crudo)
    12: [0, 0.1, 0, 0, 0, 0, 0.05], // chicken (Crudo)
    13: [0, 0.15, 0, 0, 0, 0, 0.05], // mutton
    14: [0, 0.12, 0, 0, 0, 0, 0], // rabbit
    15: [0, 0.12, 0, 0, 0, 0, 0], // cod
    16: [0, 0.12, 0, 0, 0, 0, 0.05], // salmon
    17: [0, 0.1, 0, 0, 0, 0, 0], // tropical_fish
    19: [0, 0.05, 0, 0, 0, 0, 0.02], // rotten_flesh

    // Cocinadas (Nutrición óptima)
    // Subimos al 30% aprox. 3-4 carnes llenan la barra.
    20: [0, 0.3, 0, 0, 0, 0, 0.15], // cooked_beef (30% Prot + Grasa)
    21: [0, 0.25, 0, 0, 0, 0, 0.2], // cooked_porkchop (Menos prot, mucha grasa)
    22: [0, 0.25, 0, 0, 0, 0, 0.1], // cooked_chicken
    23: [0, 0.25, 0, 0, 0, 0, 0.15], // cooked_mutton
    24: [0, 0.25, 0, 0, 0, 0, 0.05], // cooked_rabbit (Magra)
    25: [0, 0.2, 0, 0, 0, 0, 0], // cooked_cod (Ligero)
    26: [0, 0.25, 0, 0, 0, 0, 0.15], // cooked_salmon (Excelente)

    // PREPARADAS / MEZCLAS
    // Aquí es donde la regla 50g brilla. Un pastel o estofado pesa MÁS de 50g.
    // Asumimos que el estofado es la suma de sus partes (~200g).
    27: [0, 0, 0, 0.15, 0.2, 0, 0.1], // cookie (Pequeña pero densa)
    28: [0.1, 0.1, 0, 0.4, 0.6, 0.3, 0.3], // cake (Slice grande: Muy potente)
    29: [0.1, 0, 0.3, 0.3, 0.4, 0.1, 0.2], // pumpkin_pie

    // ESTOFADOS (La Meta del Juego)
    // Rabbit Stew = Rabbit(25%) + Potato(25%) + Carrot(20%) + Mushroom.
    // Suma lógica = ~70-80%. Un solo estofado es casi una comida completa.
    30: [0, 0.4, 0.4, 0.1, 0, 0, 0.2], // rabbit_stew (Plato Completo)
    31: [0, 0, 0.6, 0, 0, 0, 0], // beetroot_soup (60% Veg - Muy saludable)
    32: [0, 0.1, 0.5, 0, 0, 0, 0], // mushroom_stew
    33: [0, 0.1, 0.4, 0, 0, 0, 0], // suspicious_stew

    46: [0, 0, 0, 0, 0, 0.15, 0],
    47: [0, 0.05, 0.2, 0, 0.02, 0, 0],
    48: [0, 0, 0.08, 0, 0, 0, 0],
    49: [0, 0, 0, 0.15, 0, 0, 0],
    50: [0, 0.3, 0.3, 0.25, 0, 0, 0],
    51: [0, 0.2, 0, 0, 0, 0, 0],
    52: [0, 0.25, 0, 0.3, 0, 0, 0],
    53: [0.03, 0.25, 0.1, 0.25, 0, 0, 0],
    54: [0, 0.08, 0, 0, 0, 0, 0.05],
    55: [0, 0.18, 0, 0, 0, 0, 0.1],
    56: [0.03, 0.3, 0.1, 0.3, 0, 0, 0.05],

    // BOWL FOODS (Comidas con cuenco - Mayor aporte nutricional combinado)
    // [frutas, proteinas, vegetales, granos, azúcares, lácteos, grasas]
    57: [0, 0.4, 0, 0, 0, 0, 0.3], // bacon_and_eggs (Prot + Grasa fuerte)
    58: [0, 0.35, 0.3, 0.15, 0, 0, 0.1], // baked_cod_stew (Cod + Potato + Onion)
    59: [0, 0.5, 0.3, 0.15, 0, 0, 0.25], // beef_stew (Beef + Potato + Carrot - El mejor)
    60: [0, 0.2, 0.1, 0, 0, 0, 0.1], // bone_broth (Ligero, base caldo)
    61: [0, 0.4, 0.25, 0, 0, 0, 0.15], // chicken_soup (Chicken + Carrot + Onion)
    62: [0, 0, 0, 0.45, 0, 0, 0], // cooked_rice (Puro grano, simple)
    63: [0, 0.4, 0.2, 0, 0, 0, 0.15], // fish_stew (Salmon + Tomato + Onion)
    64: [0, 0.15, 0.15, 0.35, 0, 0, 0.1], // fried_rice (Rice + Egg + Onion)
    65: [0.1, 0, 0.5, 0, 0.05, 0, 0], // mixed_salad (Cabbage + Carrot + Tomato)
    66: [0, 0, 0.3, 0.2, 0.1, 0, 0], // pumpkin_soup (Pumpkin + Onion)
    67: [0.15, 0, 0.3, 0, 0.05, 0, 0], // tomato_sauce (Tomato x2 + Onion)
    68: [0, 0.05, 0.15, 0.35, 0, 0, 0.05], // mushroom_rice (Rice + Mushroom)
    69: [0, 0.55, 0.15, 0.2, 0, 0, 0.3], // steak_and_potatoes (Cooked Beef + Baked Potato)
    70: [0, 0, 0.5, 0, 0, 0, 0], // vegetable_soup (Cabbage + Carrot + Onion)
    71: [0, 0, 0, 0, 0, 0.03, 0],
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
    BASE_BURN_PER_TICK: 0.0000015,

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
        rainSensitivity: data[5], // NUEVO DATO
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
};
