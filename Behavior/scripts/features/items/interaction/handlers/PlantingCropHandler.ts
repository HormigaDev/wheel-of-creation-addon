import { InteractionHandler, InteractionContext } from '../types';
import {
    SEED_TO_CROP_MAP,
    VALID_FARMLANDS,
    SUGARCANE_SOILS,
    QUALITY_SEED_ITEMS,
    MIN_HYDRATION_FOR_SUGARCANE,
} from '../config';
import { consumeItemInHand, hasAdjacentWater, getFarmlandHydration } from '../utils';
import { getAtmosphericHumidity } from '../../../../config';

/**
 * Handler para plantar cultivos desde semillas
 */
export class PlantingCropHandler implements InteractionHandler {
    canHandle(ctx: InteractionContext): boolean {
        const cropBlockId = SEED_TO_CROP_MAP[ctx.item.typeId];
        if (!cropBlockId) return false;

        const blockAbove = ctx.block.above(1);
        if (!blockAbove?.isAir) return false;

        return this.isValidPlacement(ctx, cropBlockId);
    }

    execute(ctx: InteractionContext): void {
        const { block, player, item } = ctx;
        const blockAbove = block.above(1);

        if (!block.isValid || !blockAbove?.isValid) return;

        const cropBlockId = SEED_TO_CROP_MAP[item.typeId];

        // Convertir farmland vanilla a WoC si es necesario
        if (block.typeId === 'minecraft:farmland') {
            const biome = block.dimension.getBiome(block.location);
            const initialHydration = getAtmosphericHumidity(biome.id, block.location);

            block.setType('woc:farmland');
            const perm = block.permutation.withState('woc:hydration' as any, initialHydration);
            block.setPermutation(perm);
        }

        // Colocar el cultivo
        blockAbove.setType(cropBlockId);

        // Establecer calidad si es semilla de calidad
        this.applyQuality(blockAbove, item.typeId);

        // Efectos de sonido
        const isColumnCrop = cropBlockId === 'woc:column_sugar_cane';
        const sound = isColumnCrop ? 'block.grass.place' : 'dig.grass';
        block.dimension.playSound(sound, blockAbove.location);

        consumeItemInHand(player);
    }

    private isValidPlacement(ctx: InteractionContext, cropBlockId: string): boolean {
        const isColumnCrop = cropBlockId === 'woc:column_sugar_cane';

        if (isColumnCrop) {
            return this.isValidSugarcanePlacement(ctx.block);
        }

        return VALID_FARMLANDS.has(ctx.block.typeId);
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
