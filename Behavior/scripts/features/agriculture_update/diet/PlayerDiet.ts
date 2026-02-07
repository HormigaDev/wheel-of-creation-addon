import { Player } from '@minecraft/server';
import { FOOD_MAP, FOOD_PROPERTIES, Nutrition, ADDON } from '../../../config';
import { logger } from '../../../utils/ErrorHandler';

const MAX_HISTORY_SIZE = 20;
const MAX_SATURATION = 1.0;

const I_FRUIT = 0;
const I_PROTEIN = 1;
const I_GRAIN = 3;
const I_SUGAR = 4;
const I_FAT = 6;

const BURN_RATES: number[] = [
    1.5, // 0: Frutas
    1.0, // 1: Proteína
    1.2, // 2: Vegetales
    0.8, // 3: Granos
    1.5, // 4: Azúcares
    0.9, // 5: Lácteos
    0.2, // 6: Grasas
];

export class PlayerDiet {
    private readonly DIET_HISTORY_KEY: string = 'woc:diet_history';
    private readonly DIET_KEY: string = 'woc:diet_stats';

    private _cachedDiet: Nutrition | null = null;
    private _cachedHistory: number[] | null = null;
    private isDirty: boolean = false;

    constructor(private _player: Player) {
        this.load();
    }

    public get player(): Player {
        return this._player;
    }

    private load(): void {
        try {
            const rawHistory = this.player.getDynamicProperty(this.DIET_HISTORY_KEY) as string;
            const rawDiet = this.player.getDynamicProperty(this.DIET_KEY) as string;

            this._cachedHistory = rawHistory ? JSON.parse(rawHistory) : [];
            this._cachedDiet = rawDiet ? JSON.parse(rawDiet) : [0, 0, 0, 0, 0, 0, 0];
        } catch (e) {
            logger.error('Error corrupt data loading diet', e, 'PlayerDiet.load');
            this._cachedHistory = [];
            this._cachedDiet = [0, 0, 0, 0, 0, 0, 0];
        }
    }

    public save(): void {
        if (!this.isDirty || !this._cachedDiet || !this._cachedHistory) return;

        try {
            this.player.setDynamicProperty(
                this.DIET_HISTORY_KEY,
                JSON.stringify(this._cachedHistory),
            );
            this.player.setDynamicProperty(this.DIET_KEY, JSON.stringify(this._cachedDiet));
            this.isDirty = false;
        } catch (e) {
            logger.error('Failed to save diet data', e, 'PlayerDiet.save');
        }
    }

    public addFood(itemIdentifier: string): boolean {
        const foodId = FOOD_MAP.getByKey(itemIdentifier);
        if (foodId === undefined) return false;

        const nutrients = FOOD_PROPERTIES.get(foodId);
        if (!nutrients) return false;

        let varietyMultiplier = 1.0;

        if (this._cachedHistory) {
            let repeatCount = 0;
            const len = this._cachedHistory.length;
            const startIndex = len > 10 ? len - 10 : 0;

            for (let k = len - 1; k >= startIndex; k--) {
                if (this._cachedHistory[k] === foodId) {
                    repeatCount++;
                }
            }

            const penalty = repeatCount * 0.1;
            varietyMultiplier = penalty > 0.8 ? 0.2 : 1.0 - penalty;
        }

        if (this._cachedDiet) {
            for (let i = 0; i < 7; i++) {
                const effectiveGain = nutrients[i] * varietyMultiplier;
                let val = this._cachedDiet[i] + effectiveGain;

                if (val > MAX_SATURATION) val = MAX_SATURATION;

                this._cachedDiet[i] = Math.round(val * 10000) / 10000;
            }
        }

        if (this._cachedHistory) {
            this._cachedHistory.push(foodId);
            if (this._cachedHistory.length > MAX_HISTORY_SIZE) {
                this._cachedHistory.shift();
            }
        }

        this.isDirty = true;
        this.save();

        return true;
    }

    public getStats(): Nutrition {
        const stats: Nutrition = [0, 0, 0, 0, 0, 0, 0];
        if (this._cachedDiet) {
            for (const i in this._cachedDiet) {
                stats[i] = Math.floor(this._cachedDiet[i] * 100);
            }
        }
        return stats;
    }

    public digest(baseAmount: number): void {
        if (!this._cachedDiet) return;

        let activityMultiplier = 1.0;

        if (ADDON.enablePhysicalActivityDietImpact && this.player.isValid) {
            try {
                if (this.player.isSprinting) activityMultiplier = 3.5;
                else if (this.player.isSneaking) activityMultiplier = 0.8;
                else if (this.player.isSwimming) activityMultiplier = 2.5;
                else if (this.player.isClimbing) activityMultiplier = 2.0;
                else if (this.player.isGliding) activityMultiplier = 1.5;
                else if (this.player.isSleeping) activityMultiplier = 0.2;
            } catch (e) {
                activityMultiplier = 1.0;
            }
        }

        const finalBurnAmount = baseAmount * activityMultiplier;

        const diet = this._cachedDiet;
        const sugarLevel = diet[I_SUGAR];
        const grainLevel = diet[I_GRAIN];
        const fatLevel = diet[I_FAT];

        const hasFastEnergy = sugarLevel + grainLevel > 0.3;
        const isHighIntensity = activityMultiplier > 2.0;

        let hasChanged = false;

        for (let i = 0; i < 7; i++) {
            let val = diet[i];
            if (val <= 0) continue;

            let rate = BURN_RATES[i];

            if (val > 0.8) rate *= 0.5;
            else if (val < 0.2) rate *= 1.2;

            if (hasFastEnergy) {
                if (i === I_FAT || i === I_PROTEIN) rate *= 0.1;
            }

            if (isHighIntensity) {
                if (i === I_FRUIT || i === I_SUGAR) rate *= 1.5;
            }

            if (i === I_SUGAR && fatLevel < 0.1) {
                rate *= 2.0;
            }

            const drop = finalBurnAmount * rate;
            val = val - drop;

            if (val < 0) val = 0;

            diet[i] = Math.round(val * 10000) / 10000;
            hasChanged = true;
        }

        if (hasChanged) {
            this.isDirty = true;
        }
    }
}
