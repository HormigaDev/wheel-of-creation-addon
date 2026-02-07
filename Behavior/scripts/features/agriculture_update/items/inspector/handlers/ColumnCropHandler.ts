import { Block, RawMessage } from '@minecraft/server';
import { getBiomeTemperature } from '../../../../../config';
import { COLUMN_CROP_REGISTRY } from '../../../blocks/crops/configs';
import { BlockInspectorHandler, InspectorContext } from '../types';
import { getSoilData, checkWaterSource, isPreferredBiome, getBlockState } from '../utils';

/**
 * Handler para cultivos de columna (caña de azúcar)
 */
export class ColumnCropHandler implements BlockInspectorHandler {
    canHandle(block: Block): boolean {
        return block.typeId in COLUMN_CROP_REGISTRY;
    }

    getDisplayComponents(ctx: InspectorContext): (RawMessage | string)[] {
        const components: (RawMessage | string)[] = [];
        const config = COLUMN_CROP_REGISTRY[ctx.block.typeId];

        const blockBelow = ctx.block.below(1);
        const isBrain = !blockBelow || blockBelow.typeId !== config.id;
        const biome = ctx.block.dimension.getBiome(ctx.block.location);
        const cropTemp = getBiomeTemperature(biome.id, ctx.block.location);
        const isPreferred = isPreferredBiome(biome.id, config.preferredBiomes);

        components.push('\n');

        if (isBrain) {
            this.appendBrainInfo(components, ctx, config);
        } else {
            components.push({ translate: 'woc.inspector.column_segment' });
        }

        components.push('\n');
        this.appendTemperatureInfo(components, cropTemp, config);

        if (isPreferred) {
            components.push(' ');
            components.push({ translate: 'woc.inspector.preferred_biome' });
        }

        this.appendWaterRequirementInfo(components, ctx.block, config);

        return components;
    }

    private appendBrainInfo(
        components: (RawMessage | string)[],
        ctx: InspectorContext,
        config: (typeof COLUMN_CROP_REGISTRY)[string],
    ): void {
        const quality = getBlockState(ctx.block, 'woc:quality', 0);
        const isWild = quality === 0;
        const typeKey = isWild ? 'woc.inspector.quality.wild' : 'woc.inspector.quality.select';

        const soil = ctx.block.below(1);
        const soilData = getSoilData(soil);
        const fertilizer = soilData?.fertilizer ?? 0;

        const produced = getBlockState(ctx.block, 'woc:produced_count', 0);
        const maxLife = 5 + fertilizer;
        const lifeColor = produced >= maxLife ? '§c' : '§a';

        components.push({ translate: 'woc.inspector.column_brain' });
        components.push(' ');
        components.push({ translate: typeKey });
        components.push('\n');

        components.push({ translate: 'woc.inspector.life_label' });
        components.push(`${lifeColor}${produced}§7 / ${maxLife} `);
        components.push({ translate: 'woc.inspector.unit.segments' });
    }

    private appendTemperatureInfo(
        components: (RawMessage | string)[],
        temperature: number,
        config: (typeof COLUMN_CROP_REGISTRY)[string],
    ): void {
        const tempColor =
            temperature < config.minTemp || temperature > config.maxTemp ? '§c' : '§a';

        components.push({
            translate: 'woc.inspector.temp_fmt',
            with: [`${tempColor}${temperature}`],
        });
    }

    private appendWaterRequirementInfo(
        components: (RawMessage | string)[],
        block: Block,
        config: (typeof COLUMN_CROP_REGISTRY)[string],
    ): void {
        if (!config.requiredWaterSource) return;

        const hasWater = checkWaterSource(block);
        if (!hasWater) {
            components.push('\n');
            components.push({ translate: 'woc.inspector.needs_water' });
        }
    }
}
