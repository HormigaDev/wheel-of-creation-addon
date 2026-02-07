import { Block } from '@minecraft/server';
import { getBiomeRisks, getBiomeTemperature } from '../../../config';
import { HIGH_WATER_THRESHOLD } from './constants';
import { getHydration, getFertilizerLevel, isPreferredBiome, isWildCrop } from './utils';

/**
 * Opciones base compartidas por todos los tipos de cultivos
 */
export interface BaseCropConfig {
    minHydro: number;
    maxHydro: number;
    minTemp: number;
    maxTemp: number;
    weedProbability: number;
    preferredBiomes: string[];
}

/**
 * Resultado del análisis de condiciones ambientales
 */
export interface EnvironmentAnalysis {
    temperature: number;
    hydration: number;
    fertilizerLevel: number;
    biomeId: string;
    isPreferred: boolean;
    risks: ReturnType<typeof getBiomeRisks>;
    isWild: boolean;
}

/**
 * Resultado de la verificación de supervivencia
 */
export interface SurvivalCheck {
    shouldDie: boolean;
    deathType?: 'dead' | 'rotten';
    reason?: string;
}

/**
 * Analiza las condiciones ambientales de un cultivo
 */
export function analyzeEnvironment(
    block: Block,
    soilBlock: Block | undefined,
    config: BaseCropConfig,
): EnvironmentAnalysis {
    const biome = block.dimension.getBiome(block.location);
    const biomeId = biome.id.replace('minecraft:', '');

    return {
        temperature: getBiomeTemperature(biome.id, block.location),
        hydration: getHydration(soilBlock),
        fertilizerLevel: getFertilizerLevel(soilBlock),
        biomeId,
        isPreferred: isPreferredBiome(biome.id, config.preferredBiomes),
        risks: getBiomeRisks(biome.id),
        isWild: isWildCrop(block),
    };
}

/**
 * Verifica si el cultivo debe morir por condiciones ambientales
 */
export function checkSurvival(env: EnvironmentAnalysis, config: BaseCropConfig): SurvivalCheck {
    // Muerte por sequía
    if (env.hydration === 0) {
        return { shouldDie: true, deathType: 'dead', reason: 'drought' };
    }

    // Muerte por exceso de calor
    if (env.temperature > config.maxTemp) {
        return { shouldDie: true, deathType: 'dead', reason: 'heat' };
    }

    // Verificar pudrición (solo si no es inmune)
    const isImmuneToRot = config.maxHydro === 10;
    if (!isImmuneToRot) {
        const rotPenalty = env.isWild ? 2.0 : 1.0;
        const biomeRotProtection = env.isPreferred ? 0.1 : 1.0;
        const isHighWater = env.hydration >= HIGH_WATER_THRESHOLD;
        const rotRoll = Math.random() < env.risks.rotChance * rotPenalty * biomeRotProtection;

        if (env.hydration > config.maxHydro || (isHighWater && rotRoll)) {
            return { shouldDie: true, deathType: 'rotten', reason: 'overwatering' };
        }
    }

    return { shouldDie: false };
}

/**
 * Verifica si el cultivo debería convertirse en maleza
 */
export function shouldBecomeWeed(
    env: EnvironmentAnalysis,
    config: BaseCropConfig,
    currentStage: number,
    maxStageForWeeds: number,
): boolean {
    // Las etapas avanzadas son inmunes a la maleza
    if (currentStage >= maxStageForWeeds) return false;

    // Los cultivos selectos son muy resistentes
    if (!env.isWild) return false;

    // No hay probabilidad de maleza
    if (config.weedProbability <= 0) return false;

    const geneticsFactor = 1.0; // Salvaje = 100% vulnerable
    const biomeFactor = env.isPreferred ? 0.1 : 1.0;
    const soilCareFactor = env.fertilizerLevel > 0 ? 0.5 : 1.0;
    const baseChance = config.weedProbability * 0.5;

    const combinedChance =
        (baseChance + env.risks.weedChance) * geneticsFactor * soilCareFactor * biomeFactor;

    const maxChance = env.isPreferred ? 0.05 : 0.2;
    const finalChance = Math.min(combinedChance, maxChance);

    return finalChance > 0 && Math.random() < finalChance;
}

/**
 * Calcula el multiplicador de crecimiento basado en las condiciones
 */
export function calculateGrowthMultiplier(
    env: EnvironmentAnalysis,
    config: BaseCropConfig,
): number {
    let multiplier = 1.0;

    // Penalización por poca agua
    if (env.hydration < config.minHydro) {
        multiplier *= 0.1;
    }

    // Penalización por ser salvaje
    if (env.isWild) {
        multiplier *= 0.7;
    }

    // Bonificación por bioma preferido
    if (env.isPreferred) {
        multiplier *= 1.5;
    }

    return multiplier;
}

/**
 * Verifica si el cultivo está en dormancia por frío
 */
export function isDormant(temperature: number, minTemp: number): boolean {
    return temperature < minTemp;
}
