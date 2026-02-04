import { Block, RawMessage } from '@minecraft/server';
import { CropOptions, StemCropOptions, ColumnCropOptions } from '../../blocks/crops/configs';

/**
 * Contexto pasado a cada handler del inspector de bloques
 */
export interface InspectorContext {
    block: Block;
    biomeId: string;
    temperature: number;
}

/**
 * Interfaz para los handlers del inspector de bloques
 */
export interface BlockInspectorHandler {
    /**
     * Verifica si este handler puede procesar el bloque dado
     */
    canHandle(block: Block): boolean;

    /**
     * Genera los componentes de visualización para este bloque
     */
    getDisplayComponents(ctx: InspectorContext): (RawMessage | string)[];
}

/**
 * Datos del suelo extraídos del bloque de tierra de cultivo
 */
export interface SoilData {
    hydration: number;
    fertilizer: number;
}

/**
 * Tipo unión para todas las configuraciones de cultivos
 */
export type AnyCropConfig = CropOptions | StemCropOptions | ColumnCropOptions;
