import { BlockInspectorHandler } from '../types';
import { BaseCropHandler } from './BaseCropHandler';
import { StemCropHandler } from './StemCropHandler';
import { ColumnCropHandler } from './ColumnCropHandler';
import { WaterCropHandler } from './WaterCropHandler';
import { FarmlandHandler } from './FarmlandHandler';
import { ComposterHandler } from './ComposterHandler';
import { DeadCropHandler } from './DeadCropHandler';

/**
 * Registro de todos los handlers del inspector de bloques.
 * El orden importa: los handlers más específicos deben ir antes que los genéricos.
 */
export const BLOCK_HANDLERS: BlockInspectorHandler[] = [
    new BaseCropHandler(),
    new StemCropHandler(),
    new WaterCropHandler(),
    new FarmlandHandler(),
    new ColumnCropHandler(),
    new ComposterHandler(),
    new DeadCropHandler(),
];

/**
 * Encuentra el handler apropiado para un tipo de bloque dado
 */
export function findHandler(block: { typeId: string }): BlockInspectorHandler | undefined {
    return BLOCK_HANDLERS.find((handler) => handler.canHandle(block as any));
}

export { BaseCropHandler } from './BaseCropHandler';
export { StemCropHandler } from './StemCropHandler';
export { ColumnCropHandler } from './ColumnCropHandler';
export { WaterCropHandler } from './WaterCropHandler';
export { FarmlandHandler } from './FarmlandHandler';
export { ComposterHandler } from './ComposterHandler';
export { DeadCropHandler } from './DeadCropHandler';
