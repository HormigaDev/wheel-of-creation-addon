import { Block } from '@minecraft/server';

const BIOME_TEMPS: Record<string, number> = {
    'minecraft:frozen_ocean': 0.0,
    'minecraft:frozen_river': 0.0,
    'minecraft:ice_plains': 0.0,
    'minecraft:cold_beach': 0.05,
    'minecraft:plains': 0.8,
    'minecraft:forest': 0.7,
    'minecraft:sunflower_plains': 0.8,
    'minecraft:flower_forest': 0.7,
    'minecraft:birch_forest': 0.6,
    'minecraft:jungle': 0.95,
    'minecraft:savanna': 1.1,
    'minecraft:desert': 2.0,
    'minecraft:mesa': 2.0,
    'minecraft:taiga': 0.25,
    'minecraft:swampland': 0.8,
    'minecraft:river': 0.5,
    'minecraft:ocean': 0.5,
};

export function getBiomeTemperature(biomeId: string) {
    return BIOME_TEMPS[biomeId];
}

export function getBlockKey(block: Block) {
    const { x, y, z } = block.location;
    return `woc_crop:${x}_${y}_${z}`;
}

export interface CropData {
    bornTick: number;
    lastTick: number;
    accumulatedGrowth: number;
    isDead: boolean;
}
