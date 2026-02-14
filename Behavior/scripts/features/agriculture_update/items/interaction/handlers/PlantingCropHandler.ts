import { InteractionHandler, InteractionContext } from '../types';
import {
    SEED_TO_CROP_MAP,
    VALID_FARMLANDS,
    SUGARCANE_SOILS,
    QUALITY_SEED_ITEMS,
    MIN_HYDRATION_FOR_SUGARCANE,
} from '../config';
import { consumeItemInHand, hasAdjacentWater, getFarmlandHydration } from '../utils';
import { getAtmosphericHumidity } from '../../../../../config';

/**
 * Suelos válidos para plantar arroz
 */
const RICE_SOILS: ReadonlySet<string> = new Set(['minecraft:dirt', 'minecraft:mud']);

/**
 * Tipos de agua que indican que el jugador está mirando agua
 */
const WATER_BLOCKS: ReadonlySet<string> = new Set(['minecraft:water', 'minecraft:flowing_water']);

/**
 * Handler para plantar cultivos desde semillas
 */
export class PlantingCropHandler implements InteractionHandler {
    canHandle(ctx: InteractionContext): boolean {
        const cropBlockId = SEED_TO_CROP_MAP[ctx.item.typeId];
        if (!cropBlockId) return false;

        // Para arroz, permitir interacción con agua y buscar suelo debajo
        if (cropBlockId === 'woc:rices') {
            return this.canHandleRicePlanting(ctx);
        }

        const blockAbove = ctx.block.above(1);
        if (!blockAbove?.isAir) return false;

        return this.isValidPlacement(ctx, cropBlockId);
    }

    private canHandleRicePlanting(ctx: InteractionContext): boolean {
        // Si se hace clic en agua, buscar el suelo debajo
        if (WATER_BLOCKS.has(ctx.block.typeId) || ctx.block.isWaterlogged) {
            const soil = this.findSoilBelowWater(ctx.block);
            if (!soil) return false;
            // Verificar que no haya ya arroz plantado
            const aboveSoil = soil.above(1);
            if (aboveSoil?.typeId === 'woc:rices') return false;
            return true;
        }

        // Si se hace clic directamente en el suelo con agua adyacente
        if (RICE_SOILS.has(ctx.block.typeId)) {
            const blockAbove = ctx.block.above(1);
            if (!blockAbove) return false;
            // Verificar que no haya ya arroz plantado
            if (blockAbove.typeId === 'woc:rices') return false;
            // El bloque arriba debe ser agua o aire (que se llenará de agua)
            return (
                WATER_BLOCKS.has(blockAbove.typeId) ||
                blockAbove.isWaterlogged ||
                (blockAbove.isAir && hasAdjacentWater(ctx.block))
            );
        }

        return false;
    }

    /**
     * Busca el suelo válido debajo de un bloque de agua
     */
    private findSoilBelowWater(
        waterBlock: import('@minecraft/server').Block,
    ): import('@minecraft/server').Block | null {
        let current = waterBlock.below(1);

        // Buscar hasta 2 bloques de profundidad (agua poco profunda)
        for (let i = 0; i < 2 && current; i++) {
            if (RICE_SOILS.has(current.typeId)) {
                // Verificar que arriba del suelo haya agua
                const aboveSoil = current.above(1);
                if (aboveSoil && (WATER_BLOCKS.has(aboveSoil.typeId) || aboveSoil.isWaterlogged)) {
                    return current;
                }
            }
            // Si encontramos otro tipo de bloque sólido, parar
            if (!WATER_BLOCKS.has(current.typeId) && !current.isWaterlogged) {
                break;
            }
            current = current.below(1);
        }

        return null;
    }

    execute(ctx: InteractionContext): void {
        const { block, player, item } = ctx;
        const cropBlockId = SEED_TO_CROP_MAP[item.typeId];
        const isRiceCrop = cropBlockId === 'woc:rices';

        // Para arroz, encontrar el suelo correcto
        let targetSoil = block;
        if (isRiceCrop) {
            if (WATER_BLOCKS.has(block.typeId) || block.isWaterlogged) {
                const soil = this.findSoilBelowWater(block);
                if (!soil) return;
                targetSoil = soil;
            }
        }

        const blockAbove = targetSoil.above(1);
        if (!targetSoil.isValid || !blockAbove?.isValid) return;

        // Verificar que no haya ya un cultivo plantado (evita consumo múltiple)
        if (blockAbove.typeId === cropBlockId) return;
        // Para arroz, también verificar si ya es un bloque de arroz
        if (isRiceCrop && blockAbove.typeId === 'woc:rices') return;

        // Convertir farmland vanilla a WoC si es necesario (no aplica para arroz)
        if (!isRiceCrop && targetSoil.typeId === 'minecraft:farmland') {
            const biome = targetSoil.dimension.getBiome(targetSoil.location);
            const initialHydration = getAtmosphericHumidity(biome.id, targetSoil.location);

            targetSoil.setType('woc:farmland');
            const perm = targetSoil.permutation.withState('woc:hydration' as any, initialHydration);
            targetSoil.setPermutation(perm);
        }

        // Colocar el cultivo
        blockAbove.setType(cropBlockId);

        // Establecer calidad si es semilla de calidad
        this.applyQuality(blockAbove, item.typeId);

        // Efectos de sonido
        const isColumnCrop = cropBlockId === 'woc:column_sugar_cane';
        const sound = isColumnCrop ? 'block.grass.place' : 'dig.grass';
        targetSoil.dimension.playSound(sound, blockAbove.location);

        consumeItemInHand(player);
    }

    private isValidPlacement(ctx: InteractionContext, cropBlockId: string): boolean {
        const isColumnCrop = cropBlockId === 'woc:column_sugar_cane';

        if (isColumnCrop) {
            return this.isValidSugarcanePlacement(ctx.block);
        }

        return VALID_FARMLANDS.has(ctx.block.typeId);
    }

    private isValidRicePlacement(block: import('@minecraft/server').Block): boolean {
        // El arroz se planta en tierra/mud que debe tener agua encima
        if (!RICE_SOILS.has(block.typeId)) {
            return false;
        }

        // El bloque de arriba debe estar con agua (waterlogged) o ser agua
        const blockAbove = block.above(1);
        if (!blockAbove) return false;

        // Si hay aire arriba, verificar que el bloque actual esté waterlogged
        // o que haya agua adyacente que pueda inundar
        if (blockAbove.isAir) {
            return blockAbove.isWaterlogged || hasAdjacentWater(block);
        }

        return false;
    }

    private isValidSugarcanePlacement(block: import('@minecraft/server').Block): boolean {
        if (!SUGARCANE_SOILS.has(block.typeId)) {
            return false;
        }

        // Puede apilar sobre caña existente
        if (block.typeId === 'woc:column_sugar_cane') {
            return true;
        }

        // Requiere agua adyacente
        if (hasAdjacentWater(block)) {
            return true;
        }

        // O farmland con suficiente hidratación
        if (block.typeId === 'woc:farmland') {
            const hydration = getFarmlandHydration(block);
            return hydration >= MIN_HYDRATION_FOR_SUGARCANE;
        }

        return false;
    }

    private applyQuality(cropBlock: import('@minecraft/server').Block, seedItemId: string): void {
        const isQualitySeed = QUALITY_SEED_ITEMS.has(seedItemId);
        const qualityValue = isQualitySeed ? 1 : 0;

        try {
            const permutation = cropBlock.permutation.withState('woc:quality' as any, qualityValue);
            cropBlock.setPermutation(permutation);
        } catch {
            // Algunos cultivos pueden no tener el estado de calidad
        }
    }
}
