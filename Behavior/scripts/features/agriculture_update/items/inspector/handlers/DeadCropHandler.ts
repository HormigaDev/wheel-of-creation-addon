import { Block, RawMessage } from '@minecraft/server';
import { BlockInspectorHandler, InspectorContext } from '../types';
import { getBlockState } from '../utils';

/**
 * Mapeo de bloques de cultivos muertos a sus claves de traducción
 */
const DEAD_CROP_TRANSLATIONS: Readonly<Record<string, string>> = {
    'woc:dead_wheat': 'woc.crop.wheat',
    'woc:dead_carrots': 'woc.crop.carrot',
    'woc:dead_potatoes': 'woc.crop.potatoes',
    'woc:dead_beetroots': 'woc.crop.beetroots',
    'woc:dead_onions': 'woc.crop.onions',
    'woc:dead_cabbages': 'woc.crop.cabbages',
    'woc:dead_tomatoes': 'woc.crop.tomatoes',
};

/**
 * Mapeo de stem/column dead crops que aún usan variant
 */
const DEAD_VARIANT_MAPPINGS: Readonly<Record<string, string[]>> = {
    'woc:stem_dead_crop': ['woc.crop.pumpkin', 'woc.crop.melon'],
    'woc:column_dead_crop': ['woc.crop.sugar_cane'],
};

/**
 * Handler para bloques de cultivos muertos
 */
export class DeadCropHandler implements BlockInspectorHandler {
    canHandle(block: Block): boolean {
        return block.typeId.includes('dead_');
    }

    getDisplayComponents(ctx: InspectorContext): (RawMessage | string)[] {
        const components: (RawMessage | string)[] = [];

        const deadType = getBlockState<number>(ctx.block, 'woc:type', 0);
        const deathCause = deadType === 1 ? 'rotten' : 'dead';

        const translateId = this.getTranslationKey(ctx.block.typeId, ctx.block, deathCause);

        components.push('   ');
        components.push({ translate: translateId });

        return components;
    }

    private getTranslationKey(blockTypeId: string, block: Block, deathCause: string): string {
        // Primero verificar bloques individuales (nuevos)
        const directTranslation = DEAD_CROP_TRANSLATIONS[blockTypeId];
        if (directTranslation) {
            return `${directTranslation}.${deathCause}`;
        }

        // Luego verificar bloques con variantes (stem/column)
        const variantNames = DEAD_VARIANT_MAPPINGS[blockTypeId];
        if (variantNames) {
            const variant = getBlockState<number>(block, 'woc:variant', 0);
            const cropName = variantNames[variant] ?? 'woc.crop.unknown';
            return `${cropName}.${deathCause}`;
        }

        return 'woc.crop.unknown.dead';
    }
}
