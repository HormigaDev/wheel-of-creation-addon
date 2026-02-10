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

// Tasa de quema por nutriente (mayor = se quema más rápido)
const BURN_RATES: number[] = [
    1.4, // 0: Frutas
    0.9, // 1: Proteína
    1.1, // 2: Vegetales
    1.0, // 3: Granos
    1.6, // 4: Azúcares
    0.7, // 5: Lácteos
    0.6, // 6: Grasas
];

const NUTRIENT_COUNT = 7;

// Probabilidad de quemar múltiples nutrientes por ciclo: 60% → 1, 30% → 2, 10% → 3
const MULTI_BURN_CHANCES: [number, number][] = [
    [3, 0.1],
    [2, 0.3],
];

export class PlayerDiet {
    private readonly DIET_HISTORY_KEY: string = 'woc:diet_history';
    private readonly DIET_KEY: string = 'woc:diet_stats';
    private readonly DIGEST_POOL_KEY: string = 'woc:digest_pool';

    private _cachedDiet: Nutrition | null = null;
    private _cachedHistory: number[] | null = null;
    private _digestPool: number[] = [];
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
            const rawPool = this.player.getDynamicProperty(this.DIGEST_POOL_KEY) as string;

            this._cachedHistory = rawHistory ? JSON.parse(rawHistory) : [];
            this._cachedDiet = rawDiet ? JSON.parse(rawDiet) : [0, 0, 0, 0, 0, 0, 0];
            this._digestPool = rawPool ? JSON.parse(rawPool) : [];
        } catch (e) {
            logger.error('Error corrupt data loading diet', e, 'PlayerDiet.load');
            this._cachedHistory = [];
            this._cachedDiet = [0, 0, 0, 0, 0, 0, 0];
            this._digestPool = [];
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
            this.player.setDynamicProperty(this.DIGEST_POOL_KEY, JSON.stringify(this._digestPool));
            this.isDirty = false;
        } catch (e) {
            logger.error('Failed to save diet data', e, 'PlayerDiet.save');
        }
    }

    public getRawDiet(): Nutrition | null {
        return this._cachedDiet;
    }

    public markDirty(): void {
        this.isDirty = true;
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

    /** Rellena la bolsa con los 7 índices de nutrientes en orden aleatorio. */
    private refillPool(): void {
        this._digestPool = [];
        for (let i = 0; i < NUTRIENT_COUNT; i++) {
            this._digestPool.push(i);
        }
        for (let i = this._digestPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = this._digestPool[i];
            this._digestPool[i] = this._digestPool[j];
            this._digestPool[j] = tmp;
        }
    }

    /** Determina cuántos nutrientes quemar este ciclo (limitado por el tamaño de la bolsa). */
    private rollBurnCount(): number {
        const roll = Math.random();
        let count = 1;
        let cumulative = 0;
        for (const [n, chance] of MULTI_BURN_CHANCES) {
            cumulative += chance;
            if (roll < cumulative) {
                count = n;
                break;
            }
        }
        return Math.min(count, this._digestPool.length);
    }

    /**
     * Quema 1–3 nutrientes aleatorios por ciclo usando una bolsa de barajeo.
     * Cada nutriente se quema exactamente una vez por rotación completa (sin repetidos).
     * Cuando la bolsa se vacía, se rebaraja con los 7 nutrientes.
     */
    public digest(baseAmount: number): void {
        if (!this._cachedDiet) return;

        if (this._digestPool.length === 0) {
            this.refillPool();
        }

        const burnCount = this.rollBurnCount();

        let activityMultiplier = 1.0;

        if (ADDON.enablePhysicalActivityDietImpact && this.player.isValid) {
            try {
                if (this.player.isSprinting) activityMultiplier = 2.5;
                else if (this.player.isSneaking) activityMultiplier = 0.8;
                else if (this.player.isSwimming) activityMultiplier = 2.0;
                else if (this.player.isClimbing) activityMultiplier = 1.8;
                else if (this.player.isGliding) activityMultiplier = 1.3;
                else if (this.player.isSleeping) activityMultiplier = 0.3;
            } catch (e) {
                activityMultiplier = 1.0;
            }
        }

        const diet = this._cachedDiet;
        const hasFastEnergy = diet[I_SUGAR] + diet[I_GRAIN] > 0.4;

        for (let b = 0; b < burnCount; b++) {
            const nutrientIndex = this._digestPool.pop()!;

            const val = diet[nutrientIndex];
            if (val <= 0) continue;

            let rate = BURN_RATES[nutrientIndex];

            if (val > 0.8) rate *= 0.7;
            else if (val < 0.2) rate *= 1.1;

            if (hasFastEnergy && (nutrientIndex === I_FAT || nutrientIndex === I_PROTEIN)) {
                rate *= 0.5;
            }

            if (
                activityMultiplier > 1.8 &&
                (nutrientIndex === I_FRUIT || nutrientIndex === I_SUGAR)
            ) {
                rate *= 1.3;
            }

            if (nutrientIndex === I_SUGAR && diet[I_FAT] < 0.1) {
                rate *= 1.5;
            }

            // Compensar: cada nutriente se quema una vez por rotación de 7
            const drop = baseAmount * activityMultiplier * rate * NUTRIENT_COUNT;

            let newVal = val - drop;
            if (newVal < 0) newVal = 0;

            diet[nutrientIndex] = Math.round(newVal * 10000) / 10000;
        }

        this.isDirty = true;
    }
}
