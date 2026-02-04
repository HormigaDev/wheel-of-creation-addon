import { Block, Dimension, BlockPermutation } from '@minecraft/server';
import { ScoreboardRepository } from '../../../data/ScoreboardRepository';
import { WOC_FARMLAND_ID, WEED_BLOCK_ID, DEAD_CROP_BLOCKS } from './constants';

/**
 * Obtiene el nivel de hidratación de un bloque de tierra de cultivo
 */
export function getHydration(block: Block | undefined): number {
    if (!block || block.typeId !== WOC_FARMLAND_ID) return 0;
    return (block.permutation.getState('woc:hydration' as any) as number) ?? 0;
}

/**
 * Obtiene el nivel de fertilizante de un bloque de tierra de cultivo
 */
export function getFertilizerLevel(block: Block | undefined): number {
    if (!block || block.typeId !== WOC_FARMLAND_ID) return 0;
    return (block.permutation.getState('woc:fertilizer_level' as any) as number) ?? 0;
}

/**
 * Reduce el nivel de fertilizante del suelo con una probabilidad dada
 */
export function tryConsumeFertilizer(block: Block, chance: number = 0.03): void {
    if (block.typeId !== WOC_FARMLAND_ID) return;

    const currentLevel = getFertilizerLevel(block);
    if (currentLevel <= 0) return;

    if (Math.random() < chance) {
        block.setPermutation(
            block.permutation.withState('woc:fertilizer_level' as any, currentLevel - 1),
        );
    }
}

/**
 * Verifica si hay una fuente de agua adyacente al bloque
 */
export function hasAdjacentWater(block: Block): boolean {
    const directions = [
        { x: 1, z: 0 },
        { x: -1, z: 0 },
        { x: 0, z: 1 },
        { x: 0, z: -1 },
    ];

    for (const dir of directions) {
        const neighbor = block.offset({ x: dir.x, y: 0, z: dir.z });
        if (!neighbor) continue;

        if (
            neighbor.typeId === 'minecraft:water' ||
            neighbor.typeId === 'minecraft:flowing_water' ||
            neighbor.typeId === 'minecraft:frosted_ice'
        ) {
            return true;
        }

        if (neighbor.isWaterlogged) return true;
    }

    return false;
}

/**
 * Verifica si el bioma actual es uno de los preferidos para el cultivo
 */
export function isPreferredBiome(biomeId: string, preferredBiomes: string[]): boolean {
    const cleanBiomeId = biomeId.replace('minecraft:', '');
    return preferredBiomes.some((p) => cleanBiomeId.includes(p));
}

/**
 * Obtiene la calidad de un cultivo (0 = salvaje, 1 = selecto)
 */
export function getCropQuality(block: Block): number {
    return (block.permutation.getState('woc:quality' as any) as number) ?? 0;
}

/**
 * Verifica si un cultivo es salvaje (calidad 0)
 */
export function isWildCrop(block: Block): boolean {
    return getCropQuality(block) === 0;
}

/**
 * Obtiene la etapa de crecimiento actual del cultivo
 */
export function getGrowthStage(block: Block): number {
    return (block.permutation.getState('woc:growth_stage' as any) as number) ?? 0;
}

/**
 * Establece la etapa de crecimiento del cultivo
 */
export function setGrowthStage(block: Block, stage: number): void {
    const perm = block.permutation.withState('woc:growth_stage' as any, stage);
    block.setPermutation(perm);
}

/**
 * Obtiene la cantidad de frutos/segmentos producidos
 */
export function getProducedCount(block: Block): number {
    return (block.permutation.getState('woc:produced_count' as any) as number) ?? 0;
}

/**
 * Establece la cantidad de frutos/segmentos producidos
 */
export function setProducedCount(block: Block, count: number): void {
    const safeCount = Math.min(10, Math.max(0, count));
    try {
        const perm = block.permutation.withState('woc:produced_count' as any, safeCount);
        block.setPermutation(perm);
    } catch {}
}

/**
 * Convierte un cultivo en maleza
 */
export function turnToWeed(block: Block): void {
    block.dimension.playSound('dig.grass', block.location);
    block.dimension.runCommand(
        `setblock ${block.x} ${block.y} ${block.z} ${WEED_BLOCK_ID} replace`,
    );
    ScoreboardRepository.delete(block);
}

/**
 * Opciones para matar un cultivo
 */
export interface KillCropOptions {
    block: Block;
    deathType: 'dead' | 'rotten';
    variant: number;
    deadBlockType: keyof typeof DEAD_CROP_BLOCKS;
    currentStage?: number;
}

/**
 * Mata un cultivo y lo convierte en su versión muerta
 */
export function killCrop(options: KillCropOptions): void {
    const { block, deathType, variant, deadBlockType, currentStage } = options;
    const deadBlockId = DEAD_CROP_BLOCKS[deadBlockType];

    block.dimension.runCommand(`setblock ${block.x} ${block.y} ${block.z} ${deadBlockId} replace`);

    const deadBlock = block.dimension.getBlock(block.location);
    if (deadBlock && deadBlock.typeId === deadBlockId) {
        try {
            const states: Record<string, number> = {
                'woc:variant': variant,
                'woc:type': deathType === 'rotten' ? 1 : 0,
            };

            if (currentStage !== undefined) {
                states['woc:stage'] = currentStage;
            }

            const perm = BlockPermutation.resolve(deadBlockId, states);
            deadBlock.setPermutation(perm);
        } catch {}
    }

    ScoreboardRepository.delete(block);
}

/**
 * Verifica si el suelo debajo es válido, si no lo es rompe el cultivo
 */
export function validateSoilOrBreak(
    block: Block,
    dimension: Dimension,
    validSoilId: string = WOC_FARMLAND_ID,
): boolean {
    const blockBelow = dimension.getBlock({
        x: block.location.x,
        y: block.location.y - 1,
        z: block.location.z,
    });

    return !!blockBelow && blockBelow.typeId === validSoilId;
}
