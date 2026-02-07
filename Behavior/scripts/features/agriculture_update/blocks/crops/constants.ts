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
 * IDs de bloques de cultivos muertos por tipo
 */
export const DEAD_CROP_BLOCKS = {
    base: 'woc:dead_crop',
    stem: 'woc:stem_dead_crop',
    column: 'woc:column_dead_crop',
} as const;

/**
 * Nivel mínimo de hidratación considerado "alto" para cálculos de pudrición
 */
export const HIGH_WATER_THRESHOLD = 8;

/**
 * Mapeo de nombres de cultivos base a sus índices de variante
 * Usado para los bloques de cultivo muerto
 */
export const BASE_CROP_VARIANTS: Readonly<Record<string, number>> = {
    wheat: 0,
    carrot: 1,
    carrots: 1,
    potatoes: 2,
    potato: 2,
    beetroots: 3,
    beetroot: 3,
};

/**
 * Obtiene el índice de variante para un cultivo base dado su ID
 */
export function getBaseCropVariant(cropId: string): number {
    const cropName = cropId.split(':')[1] ?? cropId;
    return BASE_CROP_VARIANTS[cropName] ?? 0;
}
