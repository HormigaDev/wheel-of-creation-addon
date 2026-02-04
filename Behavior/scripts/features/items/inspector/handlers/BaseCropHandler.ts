import { Block, RawMessage } from '@minecraft/server';
import { getBiomeTemperature } from '../../../../config';
import { BASE_CROP_REGISTRY } from '../../../blocks/crops/configs';
import { BlockInspectorHandler, InspectorContext } from '../types';
import {
    getSoilData,
    getTechnicalStatsRaw,
    getHealthTranslationKey,
    getBlockState,
} from '../utils';

/**
 * Handler para cultivos base (trigo, zanahorias, papas, remolachas)
 */
export class BaseCropHandler implements BlockInspectorHandler {
    canHandle(block: Block): boolean {
        return block.typeId in BASE_CROP_REGISTRY;
    }

    getDisplayComponents(ctx: InspectorContext): (RawMessage | string)[] {
        const components: (RawMessage | string)[] = [];
        const config = BASE_CROP_REGISTRY[ctx.block.typeId];

        const blockBelow = ctx.block.dimension.getBlock({
            x: ctx.block.x,
            y: ctx.block.y - 1,
            z: ctx.block.z,
        });

        const soilData = getSoilData(blockBelow);

        if (!soilData) {
            components.push('\n');
            components.push({ translate: 'woc.inspector.invalid_soil' });
            return components;
        }

        const biome = ctx.block.dimension.getBiome(ctx.block.location);
        const cropTemp = getBiomeTemperature(biome.id, ctx.block.location);

        components.push('\n');
        components.push(
            getTechnicalStatsRaw(soilData.hydration, soilData.fertilizer, cropTemp, config),
        );

        const stage = getBlockState(ctx.block, 'woc:growth_stage', 0);
        const percent = Math.floor((stage / config.stages) * 100);
        const pColor = percent >= 80 ? '§a' : '§f';

        components.push('\n');
        components.push({ translate: 'woc.inspector.progress_label' });

        if (percent >= 100) {
            components.push({ translate: 'woc.status.mature' });
        } else {
            components.push(`${pColor}${percent}% §7(${stage}/${config.stages})`);
        }

        components.push({ translate: 'woc.inspector.state_label' });
        components.push({
            translate: getHealthTranslationKey(
                soilData.hydration,
                soilData.fertilizer,
                cropTemp,
                config,
            ),
        });

        return components;
    }
}
