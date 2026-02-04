import { Block, RawMessage } from '@minecraft/server';
import { BlockInspectorHandler, InspectorContext } from '../types';
import { getSoilData, getTechnicalStatsRaw } from '../utils';

/**
 * Handler para bloques de tierra de cultivo
 */
export class FarmlandHandler implements BlockInspectorHandler {
    canHandle(block: Block): boolean {
        return block.typeId === 'woc:farmland';
    }

    getDisplayComponents(ctx: InspectorContext): (RawMessage | string)[] {
        const components: (RawMessage | string)[] = [];

        const soilData = getSoilData(ctx.block);

        if (!soilData) {
            return components;
        }

        components.push('\n');
        components.push(
            getTechnicalStatsRaw(soilData.hydration, soilData.fertilizer, ctx.temperature),
        );
        components.push('\n');
        components.push({ translate: 'woc.inspector.soil_ready' });

        return components;
    }
}
