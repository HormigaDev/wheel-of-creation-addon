/**
 * Constantes compartidas para la lógica de cultivos
 */

/**
 * ID del fertilizante creativo para crecimiento instantáneo
 */
export const CREATIVE_FERTILIZER_ID = 'woc:creative_fertilizer';

/**
 * ID del bloque de tierra de cultivo WoC
 */
export const WOC_FARMLAND_ID = 'woc:farmland';

/**
 * ID del bloque de maleza
 */
export const WEED_BLOCK_ID = 'woc:weed';

/**
 * IDs de bloques de cultivos muertos por tipo (stem y column)
 */
export const DEAD_CROP_BLOCKS = {
    stem: 'woc:stem_dead_crop',
    column: 'woc:column_dead_crop',
} as const;

/**
 * Nivel mínimo de hidratación considerado "alto" para cálculos de pudrición
 */
export const HIGH_WATER_THRESHOLD = 8;

/**
 * Mapeo de IDs de cultivos base a sus bloques muertos individuales
 */
export const BASE_DEAD_CROP_MAP: Readonly<Record<string, string>> = {
    wheat: 'woc:dead_wheat',
    carrots: 'woc:dead_carrots',
    carrot: 'woc:dead_carrots',
    potatoes: 'woc:dead_potatoes',
    potato: 'woc:dead_potatoes',
    beetroots: 'woc:dead_beetroots',
    beetroot: 'woc:dead_beetroots',
    onion: 'woc:dead_onions',
    onions: 'woc:dead_onions',
    cabbage: 'woc:dead_cabbages',
    cabbages: 'woc:dead_cabbages',
    tomato: 'woc:dead_tomatoes',
    tomatoes: 'woc:dead_tomatoes',
};

/**
 * Obtiene el ID del bloque muerto para un cultivo base dado su ID
 */
export function getDeadCropBlockId(cropId: string): string {
    const cropName = cropId.split(':')[1] ?? cropId;
    return BASE_DEAD_CROP_MAP[cropName] ?? 'woc:dead_wheat';
}
