import { Block, RawMessage } from '@minecraft/server';
import { getBiomeTemperature } from '../../../../../config';
import { WATER_CROP_REGISTRY } from '../../../blocks/crops/configs';
import { BlockInspectorHandler, InspectorContext } from '../types';
import { isPreferredBiome, getBlockState } from '../utils';

/**
 * Handler para cultivos acuáticos (arroz)
 * Soporta tanto la base (sumergida en agua) como el panicle (parte superior)
 */
export class WaterCropHandler implements BlockInspectorHandler {
    canHandle(block: Block): boolean {
        return block.typeId in WATER_CROP_REGISTRY;
    }

    getDisplayComponents(ctx: InspectorContext): (RawMessage | string)[] {
        const components: (RawMessage | string)[] = [];
        const config = WATER_CROP_REGISTRY[ctx.block.typeId];

        const cropType = getBlockState(ctx.block, 'woc:type', 0);
        const biome = ctx.block.dimension.getBiome(ctx.block.location);
        const cropTemp = getBiomeTemperature(biome.id, ctx.block.location);
        const isPreferred = isPreferredBiome(biome.id, config.preferredBiomes);

        components.push('\n');

        if (cropType === 0) {
            // Es base
            this.appendBaseInfo(components, ctx, config);
        } else {
            // Es panicle
            this.appendPanicleInfo(components, ctx, config);
        }

        components.push('\n');
        this.appendTemperatureInfo(components, cropTemp, config);

        if (isPreferred) {
            components.push(' ');
            components.push({ translate: 'woc.inspector.preferred_biome' });
        }

        this.appendWaterInfo(components, ctx.block, cropType);

        return components;
    }

    private appendBaseInfo(
        components: (RawMessage | string)[],
        ctx: InspectorContext,
        config: (typeof WATER_CROP_REGISTRY)[string],
    ): void {
        const quality = getBlockState(ctx.block, 'woc:quality', 0);
        const isWild = quality === 0;
        const typeKey = isWild ? 'woc.inspector.quality.wild' : 'woc.inspector.quality.select';

        const baseStage = getBlockState(ctx.block, 'woc:base_stage', 0);
        const fertilizer = getBlockState(ctx.block, 'woc:fertilizer_level', 0);

        components.push({ translate: 'woc.inspector.rice_base' });
        components.push(' ');
        components.push({ translate: typeKey });
        components.push('\n');

        // Mostrar stage de la base
        const stageColor = baseStage >= config.maxBaseStage ? '§a' : '§e';
        components.push({ translate: 'woc.inspector.growth_label' });
        components.push(`${stageColor}${baseStage}§7 / ${config.maxBaseStage}`);

        // Mostrar fertilizante
        if (fertilizer > 0) {
            components.push('\n');
            const fertColor = '§a';
            components.push({ translate: 'woc.inspector.fertilizer_label' });
            components.push(`${fertColor}${fertilizer}§7 / 10`);
        }
    }

    private appendPanicleInfo(
        components: (RawMessage | string)[],
        ctx: InspectorContext,
        config: (typeof WATER_CROP_REGISTRY)[string],
    ): void {
        const quality = getBlockState(ctx.block, 'woc:quality', 0);
        const isWild = quality === 0;
        const typeKey = isWild ? 'woc.inspector.quality.wild' : 'woc.inspector.quality.select';

        const panicleStage = getBlockState(ctx.block, 'woc:panicle_stage', 0);

        // Obtener fertilizante de la base
        const base = ctx.block.below(1);
        let fertilizer = 0;
        if (base && base.typeId === config.id) {
            fertilizer = getBlockState(base, 'woc:fertilizer_level', 0);
        }

        components.push({ translate: 'woc.inspector.rice_panicle' });
        components.push(' ');
        components.push({ translate: typeKey });
        components.push('\n');

        // Mostrar stage del panicle
        const stageColor = panicleStage >= config.maxPanicleStage ? '§a' : '§e';
        const maturityKey =
            panicleStage >= config.maxPanicleStage
                ? 'woc.inspector.mature'
                : 'woc.inspector.growing';
        components.push({ translate: 'woc.inspector.growth_label' });
        components.push(`${stageColor}${panicleStage}§7 / ${config.maxPanicleStage} `);
        components.push({ translate: maturityKey });

        // Mostrar fertilizante heredado de la base
        if (fertilizer > 0) {
            components.push('\n');
            const fertColor = '§a';
            components.push({ translate: 'woc.inspector.fertilizer_label' });
            components.push(`${fertColor}${fertilizer}§7 / 10`);
        }
    }

    private appendTemperatureInfo(
        components: (RawMessage | string)[],
        temperature: number,
        config: (typeof WATER_CROP_REGISTRY)[string],
    ): void {
        const tempColor =
            temperature < config.minTemp || temperature > config.maxTemp ? '§c' : '§a';

        components.push({
            translate: 'woc.inspector.temp_fmt',
            with: [`${tempColor}${temperature}`],
        });
    }

    private appendWaterInfo(
        components: (RawMessage | string)[],
        block: Block,
        cropType: number,
    ): void {
        // Solo verificar agua en la base
        if (cropType === 0 && !block.isWaterlogged) {
            components.push('\n');
            components.push({ translate: 'woc.inspector.needs_waterlog' });
        }
    }
}
