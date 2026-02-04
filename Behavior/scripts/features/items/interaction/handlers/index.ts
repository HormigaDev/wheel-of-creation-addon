import { InteractionHandler, InteractionContext } from '../types';
import { TillingSoilHandler } from './TillingSoilHandler';
import { PlantingCropHandler } from './PlantingCropHandler';
import { FertilizingHandler } from './FertilizingHandler';

/**
 * Registro de todos los handlers de interacción.
 * El orden importa: los handlers más específicos deben ir antes.
 */
const INTERACTION_HANDLERS: InteractionHandler[] = [
    new TillingSoilHandler(),
    new PlantingCropHandler(),
    new FertilizingHandler(),
];

/**
 * Encuentra el handler apropiado para una interacción dada
 */
export function findInteractionHandler(ctx: InteractionContext): InteractionHandler | undefined {
    return INTERACTION_HANDLERS.find((handler) => handler.canHandle(ctx));
}

export { TillingSoilHandler } from './TillingSoilHandler';
export { PlantingCropHandler } from './PlantingCropHandler';
export { FertilizingHandler } from './FertilizingHandler';
