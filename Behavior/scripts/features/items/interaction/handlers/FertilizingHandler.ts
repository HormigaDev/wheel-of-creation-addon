import { InteractionHandler, InteractionContext } from '../types';
import { MAX_FERTILIZER_LEVEL } from '../config';
import { consumeItemInHand, getFarmlandFertilizer } from '../utils';

const FERTILIZER_ITEM_ID = 'woc:fertilizer';

/**
 * Handler para aplicar fertilizante a tierra de cultivo
 */
export class FertilizingHandler implements InteractionHandler {
    canHandle(ctx: InteractionContext): boolean {
        if (ctx.block.typeId !== 'woc:farmland') return false;
        if (ctx.item.typeId !== FERTILIZER_ITEM_ID) return false;

        const currentLevel = getFarmlandFertilizer(ctx.block);
        return currentLevel < MAX_FERTILIZER_LEVEL;
    }

    execute(ctx: InteractionContext): void {
        const { block, player } = ctx;

        if (!block.isValid) return;

        const currentLevel = getFarmlandFertilizer(block);
        const newLevel = currentLevel + 1;

        block.setPermutation(block.permutation.withState('woc:fertilizer_level' as any, newLevel));

        block.dimension.playSound('item.bone_meal.use', block.location);
        block.dimension.spawnParticle('minecraft:crop_growth_emitter', block.center());

        consumeItemInHand(player);
    }
}
