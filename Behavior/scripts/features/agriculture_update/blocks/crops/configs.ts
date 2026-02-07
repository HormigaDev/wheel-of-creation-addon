import { Times } from '../../../utils/Times';

export interface CropOptions {
    id: string;
    minHydro: number;
    maxHydro: number;
    minTemp: number;
    maxTemp: number;
    growthTicks: number;
    baseDrops: number;
    seedDrops: number;
    stages: number;
    weedProbability: number;
    dropItemId: string;
    dropSeedsId: string;
    selectSeedId: string;
    preferredBiomes: string[];
}

export interface StemCropOptions {
    id: string;
    variant: number;
    minHydro: number;
    maxHydro: number;
    minTemp: number;
    maxTemp: number;
    growthTicks: number;
    fruitTicks: number;
    minFruits: number;
    maxFruit: number;
    fruitBlockId: string;
    seedId: string;
    selectSeedId: string;
    weedProbability: number;
    preferredBiomes: string[];
}

export interface ColumnCropOptions {
    id: string;
    variant: number;
    dropItemId: string;
    selectSeedId: string;
    minHydro: number;
    maxHydro: number;
    minTemp: number;
    maxTemp: number;
    preferredBiomes: string[];
    growthTicks: number;
    maxHeight: number;
    validSoils: string[];
    requiredWaterSource: boolean;
    canPlantInWater: boolean;
    fertilizerMultiplier: number;
    baseDrops: number;
    fertilizerDropFacor: number;
    breakOnInvalidChance: number;
    weedProbability: number;
    immuneToWeeds: boolean;
}

export const COLUMN_CROPS_CONFIG: ColumnCropOptions[] = [
    {
        id: 'woc:column_sugar_cane',
        variant: 0,
        dropItemId: 'minecraft:sugar_cane',
        selectSeedId: 'woc:select_sugar_cane',
        minHydro: 8,
        maxHydro: 10, // Imposible podrirse
        minTemp: 10,
        maxTemp: 45,
        preferredBiomes: [
            'swamp',
            'river',
            'jungle',
            'beach',
            'desert',
            'warm_ocean',
            'lukewarm_ocean',
        ],
        growthTicks: Times.days(16),
        maxHeight: 3,
        validSoils: [
            'woc:farmland',
            'minecraft:sand',
            'minecraft:dirt',
            'minecraft:grass_block',
            'minecraft:podzol',
            'minecraft:red_sand',
            'minecraft:mud',
        ],
        requiredWaterSource: true,
        canPlantInWater: false,
        fertilizerMultiplier: 1.5,
        baseDrops: 1,
        fertilizerDropFacor: 0.2,
        breakOnInvalidChance: 0.1,
        weedProbability: 0.01,
        immuneToWeeds: true,
    },
];

export const STEM_CROPS_CONFIG: StemCropOptions[] = [
    {
        id: 'woc:pumpkin_stem',
        variant: 0,
        minHydro: 3,
        maxHydro: 8,
        minTemp: 5,
        maxTemp: 35,
        growthTicks: Times.days(64),
        fruitTicks: Times.days(10),
        minFruits: 3,
        maxFruit: 8,
        fruitBlockId: 'minecraft:pumpkin',
        seedId: 'minecraft:pumpkin_seeds',
        selectSeedId: 'woc:pumpkin_seeds',
        weedProbability: 0.03,
        preferredBiomes: ['plains', 'forest', 'hills', 'meadow', 'mountain'],
    },
    {
        id: 'woc:melon_stem',
        variant: 1,
        minHydro: 6,
        maxHydro: 9,
        minTemp: 18,
        maxTemp: 45,
        growthTicks: Times.days(64),
        fruitTicks: Times.days(8),
        minFruits: 4,
        maxFruit: 10,
        fruitBlockId: 'minecraft:melon_block',
        seedId: 'minecraft:melon_seeds',
        selectSeedId: 'woc:melon_seeds',
        weedProbability: 0.08,
        preferredBiomes: ['jungle', 'swamp', 'river'],
    },
];

export const BASE_CROPS_CONFIG: CropOptions[] = [
    {
        id: 'woc:wheat',
        dropItemId: 'minecraft:wheat',
        dropSeedsId: 'minecraft:wheat_seeds',
        selectSeedId: 'woc:wheat_seeds',
        minHydro: 2,
        maxHydro: 9,
        minTemp: 5,
        maxTemp: 32,
        growthTicks: Times.days(48),
        baseDrops: 1,
        seedDrops: 2,
        stages: 7,
        weedProbability: 0.05,
        preferredBiomes: ['plains', 'sunflower', 'field', 'meadow'],
    },
    {
        id: 'woc:carrots',
        dropItemId: 'minecraft:carrot',
        dropSeedsId: 'minecraft:carrot',
        selectSeedId: 'woc:carrot',
        minHydro: 4,
        maxHydro: 8,
        minTemp: 8,
        maxTemp: 26,
        growthTicks: Times.days(32),
        baseDrops: 2,
        seedDrops: 0,
        stages: 3,
        weedProbability: 0.02,
        preferredBiomes: ['taiga', 'spruce', 'grove', 'meadow', 'forest'],
    },
    {
        id: 'woc:potatoes',
        dropItemId: 'minecraft:potato',
        dropSeedsId: 'minecraft:potato',
        selectSeedId: 'woc:potato',
        minHydro: 4,
        maxHydro: 7,
        minTemp: 10,
        maxTemp: 24,
        growthTicks: Times.days(60),
        baseDrops: 3,
        seedDrops: 0,
        stages: 3,
        weedProbability: 0.15,
        preferredBiomes: ['savanna', 'hills', 'mountain', 'plateau', 'mesa'],
    },
    {
        id: 'woc:beetroots',
        dropItemId: 'minecraft:beetroot',
        dropSeedsId: 'minecraft:beetroot_seeds',
        selectSeedId: 'woc:beetroot_seeds',
        minHydro: 2,
        maxHydro: 9,
        minTemp: -5,
        maxTemp: 18,
        growthTicks: Times.days(24),
        baseDrops: 1,
        seedDrops: 1,
        stages: 3,
        weedProbability: 0.08,
        preferredBiomes: ['snow', 'frozen', 'cold', 'ice'],
    },
];

export const BASE_CROP_REGISTRY: Record<string, CropOptions> = {};
export const STEM_CROP_REGISTRY: Record<string, StemCropOptions> = {};
export const COLUMN_CROP_REGISTRY: Record<string, ColumnCropOptions> = {};

BASE_CROPS_CONFIG.forEach((c) => {
    BASE_CROP_REGISTRY[c.id] = c;
});
STEM_CROPS_CONFIG.forEach((c) => {
    STEM_CROP_REGISTRY[c.id] = c;
});
COLUMN_CROPS_CONFIG.forEach((c) => {
    COLUMN_CROP_REGISTRY[c.id] = c;
});
