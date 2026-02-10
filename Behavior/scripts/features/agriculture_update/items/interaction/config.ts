/**
 * Bloques que pueden ser convertidos a tierra de cultivo con una azada
 */
export const ARABLE_BLOCKS: ReadonlySet<string> = new Set([
    'minecraft:grass_block',
    'minecraft:dirt',
    'minecraft:dirt_with_roots',
    'minecraft:grass_path',
    'minecraft:mycelium',
    'minecraft:podzol',
]);

/**
 * Tipos de tierra de cultivo válidos para plantar
 */
export const VALID_FARMLANDS: ReadonlySet<string> = new Set(['woc:farmland', 'minecraft:farmland']);

/**
 * Suelos válidos para plantar caña de azúcar
 */
export const SUGARCANE_SOILS: ReadonlySet<string> = new Set([
    'minecraft:sand',
    'minecraft:red_sand',
    'minecraft:dirt',
    'minecraft:grass_block',
    'minecraft:podzol',
    'minecraft:coarse_dirt',
    'minecraft:dirt_with_roots',
    'woc:farmland',
    'minecraft:farmland',
    'woc:column_sugar_cane',
]);

/**
 * Mapeo de semillas/items plantables a sus bloques de cultivo correspondientes
 */
export const SEED_TO_CROP_MAP: Readonly<Record<string, string>> = {
    // Vanilla seeds
    'minecraft:wheat_seeds': 'woc:wheat',
    'minecraft:beetroot_seeds': 'woc:beetroots',
    'minecraft:melon_seeds': 'woc:melon_stem',
    'minecraft:pumpkin_seeds': 'woc:pumpkin_stem',
    'minecraft:carrot': 'woc:carrots',
    'minecraft:potato': 'woc:potatoes',
    'minecraft:sugar_cane': 'woc:column_sugar_cane',

    // WoC quality seeds
    'woc:carrot': 'woc:carrots',
    'woc:potato': 'woc:potatoes',
    'woc:wheat_seeds': 'woc:wheat',
    'woc:beetroot_seeds': 'woc:beetroots',
    'woc:melon_seeds': 'woc:melon_stem',
    'woc:pumpkin_seeds': 'woc:pumpkin_stem',
    'woc:select_sugar_cane': 'woc:column_sugar_cane',

    // Cultivos de vectorwing
    'woc:onion': 'woc:onions',
    'woc:select_onion': 'woc:onions',
    'woc:cabbage_seeds': 'woc:cabbages',
    'woc:select_cabbage_seeds': 'woc:cabbages',
    'woc:tomato_seeds': 'woc:tomatoes',
    'woc:select_tomato_seeds': 'woc:tomatoes',
    'woc:rice_panicle': 'woc:rices',
    'woc:select_rice_panicle': 'woc:rices',
};

/**
 * Items de semilla que otorgan calidad al cultivo plantado
 */
export const QUALITY_SEED_ITEMS: ReadonlySet<string> = new Set([
    'woc:wheat_seeds',
    'woc:beetroot_seeds',
    'woc:carrot',
    'woc:potato',
    'woc:melon_seeds',
    'woc:pumpkin_seeds',
    'woc:select_sugar_cane',
    'woc:select_onion',
    'woc:select_cabbage_seeds',
    'woc:select_tomato_seeds',
    'woc:select_rice_panicle',
]);

/**
 * Nivel máximo de fertilizante que puede tener un bloque de tierra de cultivo
 */
export const MAX_FERTILIZER_LEVEL = 10;

/**
 * Nivel mínimo de hidratación requerido para plantar caña sin agua adyacente
 */
export const MIN_HYDRATION_FOR_SUGARCANE = 8;
