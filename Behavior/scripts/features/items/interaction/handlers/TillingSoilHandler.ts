import { InteractionHandler, InteractionContext } from '../types';
import { ARABLE_BLOCKS } from '../config';
import { damageHeldTool } from '../utils';
import { getAtmosphericHumidity } from '../../../../config';

/**
 * Handler para convertir bloques arables en tierra de cultivo usando una azada
 */
export class TillingSoilHandler implements InteractionHandler {
    canHandle(ctx: InteractionContext): boolean {
        const isHoe = ctx.item.typeId.includes('_hoe');
        const isArable = ARABLE_BLOCKS.has(ctx.block.typeId);

        return isHoe && isArable;
    }

    execute(ctx: InteractionContext): void {
        const { block, player } = ctx;

        if (!block.isValid) return;

        // Obtener hidratación inicial basada en el bioma
        const biome = block.dimension.getBiome(block.location);
        const initialHydration = getAtmosphericHumidity(biome.id, block.location);

        // Crear farmland con hidratación correcta
        block.setType('woc:farmland');
        const perm = block.permutation.withState('woc:hydration' as any, initialHydration);
        block.setPermutation(perm);

        block.dimension.playSound('step.gravel', block.location);

        player.playAnimation('animation.player.first_person.attack_rotation_item');
        player.playAnimation('animation.player.attack.rotations');

        damageHeldTool(player);
    }
}
