import { Block, Player, ItemStack } from '@minecraft/server';

/**
 * Contexto de una interacción jugador-bloque
 */
export interface InteractionContext {
    player: Player;
    block: Block;
    item: ItemStack;
}

/**
 * Resultado de validar si una interacción debe ser manejada
 */
export interface ValidationResult {
    isValid: boolean;
    reason?: string;
}

/**
 * Interfaz para handlers de interacción con bloques
 */
export interface InteractionHandler {
    /**
     * Verifica si este handler puede procesar la interacción
     */
    canHandle(ctx: InteractionContext): boolean;

    /**
     * Ejecuta la lógica de interacción (llamado dentro de system.run)
     */
    execute(ctx: InteractionContext): void;
}
