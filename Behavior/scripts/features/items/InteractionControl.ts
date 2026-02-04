import { world, system } from '@minecraft/server';
import { safeExecute } from '../../utils/ErrorHandler';
import { findInteractionHandler } from './interaction/handlers/index';
import { InteractionContext } from './interaction/types';

/**
 * Controlador principal de interacciones de jugador con bloques.
 * Delega el manejo a handlers especializados según el tipo de interacción.
 */
world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    safeExecute(() => {
        const { block, player, itemStack } = event;

        if (!itemStack || !player) return;

        const ctx: InteractionContext = {
            player,
            block,
            item: itemStack,
        };

        const handler = findInteractionHandler(ctx);

        if (handler) {
            event.cancel = true;
            system.run(() => handler.execute(ctx));
        }
    }, 'PlayerInteractWithBlock');
});
