import { Block, RawMessage } from '@minecraft/server';
import { getBiomeTemperature } from '../../../../../config';
import { STEM_CROP_REGISTRY } from '../../../blocks/crops/configs';
import { BlockInspectorHandler, InspectorContext } from '../types';
import {
    getSoilData,
    getTechnicalStatsRaw,
    getHealthTranslationKey,
    getBlockState,
    isPreferredBiome,
} from '../utils';

/**
 * Handler para cultivos de tallo (calabaza, melón)
 */
export class StemCropHandler implements BlockInspectorHandler {
    canHandle(block: Block): boolean {
        return block.typeId in STEM_CROP_REGISTRY;
    }

    getDisplayComponents(ctx: InspectorContext): (RawMessage | string)[] {
        const components: (RawMessage | string)[] = [];
        const config = STEM_CROP_REGISTRY[ctx.block.typeId];

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

        components.push('\n');

        if (stage < 7) {
            this.appendGrowingStageInfo(components, stage);
        } else {
            this.appendMatureStageInfo(components, ctx, config, soilData.fertilizer);
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

    private appendGrowingStageInfo(components: (RawMessage | string)[], stage: number): void {
        const percent = Math.floor((stage / 7) * 100);
        components.push({ translate: 'woc.inspector.progress_label' });
        components.push(`§f${percent}% §7(${stage}/7)`);
    }

    private appendMatureStageInfo(
        components: (RawMessage | string)[],
        ctx: InspectorContext,
        config: (typeof STEM_CROP_REGISTRY)[string],
        fertilizer: number,
    ): void {
        const produced = getBlockState(ctx.block, 'woc:produced_count', 0);
        const quality = getBlockState(ctx.block, 'woc:quality', 0);
        const isWild = quality === 0;

        const isPreferred = isPreferredBiome(ctx.biomeId, config.preferredBiomes);

        const maxEst = this.calculateMaxProduction(isWild, isPreferred, fertilizer);
        const lifeColor = produced >= maxEst ? '§c' : '§a';
        const typeKey = isWild ? 'woc.inspector.quality.wild' : 'woc.inspector.quality.select';

        components.push({ translate: 'woc.inspector.life_label' });
        components.push(`${lifeColor}${produced}§7 / ${maxEst} `);
        components.push({ translate: 'woc.inspector.unit.fruits' });
        components.push(' ');
        components.push({ translate: typeKey });
    }

    private calculateMaxProduction(
        isWild: boolean,
        isPreferred: boolean,
        fertilizer: number,
    ): number {
        if (isWild) return 2;

        let base = 3;
        if (isPreferred) base += 2;
        base += Math.floor(fertilizer / 2);

        return Math.min(10, base);
    }
}
