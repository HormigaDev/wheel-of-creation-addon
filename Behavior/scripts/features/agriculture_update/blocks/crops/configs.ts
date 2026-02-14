import { Times } from '../../../../utils/Times';

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
    minTemp: number;
    maxTemp: number;
    maxHydro: number;
    preferredBiomes: string[];
    growthTicks: number;
    maxHeight: number;
    maxLifeGrowths: number;
    validSoils: string[];
    baseDrops: number;
}

export interface WaterCropOptions {
    id: string;
    variant: number;
    dropItemId: string;
    selectSeedId: string;
    minTemp: number;
    maxTemp: number;
    preferredBiomes: string[];
    growthTicks: number;
    validSoils: string[];
    baseDrops: number;
    seedDrops: number;
    maxBaseStage: number;
    maxPanicleStage: number;
}

export const COLUMN_CROPS_CONFIG: ColumnCropOptions[] = [
    {
        id: 'woc:column_sugar_cane',
        variant: 0,
        dropItemId: 'minecraft:sugar_cane',
        selectSeedId: 'woc:select_sugar_cane',
        maxHydro: 10,
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
        maxLifeGrowths: 5,
        validSoils: [
            'minecraft:sand',
            'minecraft:dirt',
            'minecraft:grass_block',
            'minecraft:podzol',
            'minecraft:red_sand',
            'minecraft:mud',
        ],
        baseDrops: 1,
    },
];

export const WATER_CROPS_CONFIG: WaterCropOptions[] = [
    {
        id: 'woc:rices',
        variant: 1,
        dropItemId: 'woc:rice_panicle',
        selectSeedId: 'woc:select_rice_panicle',
        minTemp: 18,
        maxTemp: 34,
        preferredBiomes: ['swamp', 'jungle', 'river', 'lush_caves'],
        growthTicks: Times.days(64),
        validSoils: ['minecraft:dirt', 'minecraft:mud', 'minecraft:grass_block'],
        baseDrops: 1,
        seedDrops: 1,
        maxBaseStage: 4,
        maxPanicleStage: 3,
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
        minTemp: -25,
        maxTemp: 12,
        growthTicks: Times.days(24),
        baseDrops: 1,
        seedDrops: 1,
        stages: 3,
        weedProbability: 0.08,
        preferredBiomes: ['snow', 'frozen', 'cold', 'ice'],
    },
    {
        id: 'woc:tomatoes',
        dropItemId: 'woc:tomato',
        dropSeedsId: 'woc:tomato_seeds',
        selectSeedId: 'woc:select_tomato_seeds',
        minHydro: 5,
        maxHydro: 7,
        minTemp: 15,
        maxTemp: 30,
        growthTicks: Times.days(56),
        baseDrops: 4,
        seedDrops: 2,
        stages: 7,
        weedProbability: 0.18,
        preferredBiomes: ['plains', 'savanna', 'jungle', 'forest'],
    },
    {
        id: 'woc:onions',
        dropItemId: 'woc:onion',
        dropSeedsId: 'woc:onion',
        selectSeedId: 'woc:select_onion',
        minHydro: 3,
        maxHydro: 7,
        minTemp: 5,
        maxTemp: 25,
        growthTicks: Times.days(64),
        baseDrops: 3,
        seedDrops: 0,
        stages: 3,
        weedProbability: 0.06,
        preferredBiomes: ['plains', 'field', 'meadow', 'forest'],
    },
    {
        id: 'woc:cabbages',
        dropItemId: 'woc:cabbage',
        dropSeedsId: 'woc:cabbage_seeds',
        selectSeedId: 'woc:select_cabbage_seeds',
        minHydro: 4,
        maxHydro: 8,
        minTemp: -15,
        maxTemp: 15,
        growthTicks: Times.days(72),
        baseDrops: 1,
        seedDrops: 2,
        stages: 7,
        weedProbability: 0.02,
        preferredBiomes: ['taiga', 'grove', 'meadow', 'cold'],
    },
];

export const BASE_CROP_REGISTRY: Record<string, CropOptions> = {};
export const STEM_CROP_REGISTRY: Record<string, StemCropOptions> = {};
export const COLUMN_CROP_REGISTRY: Record<string, ColumnCropOptions> = {};
export const WATER_CROP_REGISTRY: Record<string, WaterCropOptions> = {};

BASE_CROPS_CONFIG.forEach((c) => {
    BASE_CROP_REGISTRY[c.id] = c;
});
STEM_CROPS_CONFIG.forEach((c) => {
    STEM_CROP_REGISTRY[c.id] = c;
});
COLUMN_CROPS_CONFIG.forEach((c) => {
    COLUMN_CROP_REGISTRY[c.id] = c;
});
WATER_CROPS_CONFIG.forEach((c) => {
    WATER_CROP_REGISTRY[c.id] = c;
});
