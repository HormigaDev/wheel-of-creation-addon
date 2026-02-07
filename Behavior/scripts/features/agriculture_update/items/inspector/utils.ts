import { Block, RawMessage } from '@minecraft/server';
import { CropOptions, StemCropOptions } from '../../blocks/crops/configs';
import { SoilData } from './types';

/**
 * Extrae los datos del suelo de un bloque de tierra de cultivo
 */
export function getSoilData(block: Block | undefined): SoilData | null {
    if (!block || block.typeId !== 'woc:farmland') {
        return null;
    }

    return {
        hydration: (block.permutation.getState('woc:hydration' as any) as number) ?? 0,
        fertilizer: (block.permutation.getState('woc:fertilizer_level' as any) as number) ?? 0,
    };
}

/**
 * Obtiene la clave de traducción del estado de salud según las condiciones del cultivo
 */
export function getHealthTranslationKey(
    hydration: number,
    fertilizer: number,
    temp: number,
    config: CropOptions | StemCropOptions,
): string {
    if (hydration > config.maxHydro) return 'woc.status.fatal_rot';
    if (hydration === 0) return 'woc.status.fatal_dry';
    if (temp > config.maxTemp) return 'woc.status.fatal_heat';
    if (temp < config.minTemp - 5) return 'woc.status.fatal_cold';

    if (hydration < config.minHydro) return 'woc.status.bad_water';
    if (temp < config.minTemp) return 'woc.status.dormant';

    const idealHydro = (config.minHydro + config.maxHydro) / 2;
    const distToIdeal = Math.abs(hydration - idealHydro);
    const tolerance = (config.maxHydro - config.minHydro) / 4;
    const isTempGood = temp >= config.minTemp && temp <= config.maxTemp;

    if (fertilizer > 0 && distToIdeal <= tolerance && isTempGood) return 'woc.status.optimal';
    if (distToIdeal <= tolerance && isTempGood) return 'woc.status.very_good';
    if (isTempGood) return 'woc.status.good';

    return 'woc.status.regular';
}

/**
 * Genera la visualización de estadísticas técnicas con valores coloreados
 */
export function getTechnicalStatsRaw(
    hydration: number,
    fertilizer: number,
    temp: number,
    config?: CropOptions | StemCropOptions,
): RawMessage {
    let hColor = '§b';
    let tColor = '§e';
    const fColor = fertilizer > 0 ? '§a' : '§7';

    if (config) {
        if (hydration < config.minHydro) hColor = '§c';
        else if (hydration > config.maxHydro) hColor = '§5';
        else if (hydration >= config.minHydro && hydration <= config.maxHydro) hColor = '§b';

        if (temp < config.minTemp) tColor = '§b';
        else if (temp > config.maxTemp) tColor = '§c';
    } else {
        if (hydration < 3) hColor = '§c';
        if (hydration > 8) hColor = '§9';
    }

    return {
        translate: 'woc.inspector.stats',
        with: [`${hColor}${hydration}`, `${fColor}${fertilizer}`, `${tColor}${temp}`],
    };
}

/**
 * Verifica si hay una fuente de agua adyacente
 */
export function checkWaterSource(block: Block): boolean {
    const directions = [
        { x: 1, z: 0 },
        { x: -1, z: 0 },
        { x: 0, z: 1 },
        { x: 0, z: -1 },
    ];

    for (const dir of directions) {
        const neighbor = block.offset({ x: dir.x, y: 0, z: dir.z });
        if (neighbor) {
            if (
                neighbor.typeId === 'minecraft:water' ||
                neighbor.typeId === 'minecraft:flowing_water'
            ) {
                return true;
            }
            if (neighbor.isWaterlogged) return true;
        }
    }

    return false;
}

/**
 * Verifica si el bioma coincide con alguno de los biomas preferidos
 */
export function isPreferredBiome(biomeId: string, preferredBiomes: string[]): boolean {
    const cleanBiomeId = biomeId.replace('minecraft:', '');
    return preferredBiomes.some((p) => cleanBiomeId.includes(p));
}

/**
 * Obtiene el valor de un estado de bloque con seguridad de tipos
 */
export function getBlockState<T>(block: Block, stateName: string, defaultValue: T): T {
    return (block.permutation.getState(stateName as any) as T) ?? defaultValue;
}
