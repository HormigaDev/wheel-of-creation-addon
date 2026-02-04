import { Block, RawMessage } from '@minecraft/server';
import { BlockInspectorHandler, InspectorContext } from '../types';
import { getBlockState } from '../utils';

/**
 * Mapeo de tipos de cultivos muertos a sus claves de traducción
 */
const DEAD_CROP_MAPPINGS: Record<string, string[]> = {
    'woc:dead_crop': [
        'woc.crop.wheat',
        'woc.crop.carrot',
        'woc.crop.potatoes',
        'woc.crop.beetroots',
    ],
    'woc:stem_dead_crop': ['woc.crop.pumpkin', 'woc.crop.melon'],
    'woc:column_dead_crop': ['woc.crop.sugar_cane'],
};

/**
 * Handler para bloques de cultivos muertos
 */
export class DeadCropHandler implements BlockInspectorHandler {
    canHandle(block: Block): boolean {
        return block.typeId.includes('dead_crop');
    }

    getDisplayComponents(ctx: InspectorContext): (RawMessage | string)[] {
        const components: (RawMessage | string)[] = [];

        const variant = getBlockState<number>(ctx.block, 'woc:variant', 0);
        const deadType = getBlockState<number>(ctx.block, 'woc:type', 0);
        const deathCause = deadType === 1 ? 'rotten' : 'dead';

        const translateId = this.getTranslationKey(ctx.block.typeId, variant, deathCause);

        components.push('   ');
        components.push({ translate: translateId });

        return components;
    }

    private getTranslationKey(blockTypeId: string, variant: number, deathCause: string): string {
        const cropNames = DEAD_CROP_MAPPINGS[blockTypeId];

        if (!cropNames) {
            return 'woc.crop.unknown.dead';
        }

        const cropName = cropNames[variant] ?? 'woc.crop.unknown';
        return `${cropName}.${deathCause}`;
    }
}
