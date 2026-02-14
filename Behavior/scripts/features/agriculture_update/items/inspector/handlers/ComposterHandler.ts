import { Block, RawMessage } from '@minecraft/server';
import { BlockInspectorHandler, InspectorContext } from '../types';
import { getBlockState } from '../utils';

/**
 * Handler para bloques de compostera mejorada
 */
export class ComposterHandler implements BlockInspectorHandler {
    canHandle(block: Block): boolean {
        return block.typeId === 'woc:better_composter';
    }

    getDisplayComponents(ctx: InspectorContext): (RawMessage | string)[] {
        const components: (RawMessage | string)[] = [];

        const green = getBlockState<number>(ctx.block, 'woc:green', 0);
        const brown = getBlockState<number>(ctx.block, 'woc:brown', 0);
        const level = getBlockState<number>(ctx.block, 'woc:level', 0);

        const gColor = green === 4 ? '§a' : '§2';
        const bColor = brown === 4 ? '§e' : '§6';

        components.push('\n');
        components.push({ translate: 'woc.inspector.composter_header' });
        components.push('\n');
        components.push({
            translate: 'woc.inspector.composter_stats',
            with: [`${gColor}${green}`, `${bColor}${brown}`],
        });
        components.push('\n');

        if (level === 4) {
            components.push({ translate: 'woc.inspector.composter_ready' });
        } else {
            components.push({ translate: 'woc.inspector.composter_mixing' });
        }

        return components;
    }
}
