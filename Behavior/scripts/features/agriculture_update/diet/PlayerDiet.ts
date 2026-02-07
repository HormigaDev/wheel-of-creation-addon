import { Player } from '@minecraft/server';
import { FOOD_MAP, FOOD_PROPERTIES, Nutrition, ADDON } from '../../../config';
import { logger } from '../../../utils/ErrorHandler';

const MAX_HISTORY_SIZE = 20;
const MAX_SATURATION = 1.0;

export class PlayerDiet {
    private readonly DIET_HISTORY_KEY: string = 'woc:diet_history';
    private readonly DIET_KEY: string = 'woc:diet_stats';

    private _cachedDiet: Nutrition | null = null;
    private _cachedHistory: number[] | null = null;
    private isDirty: boolean = false;

    /**
     * Constantes de tasa de quema (Burn Rate)
     * > 1.0: Se quema rápido (Volátil)
     * < 1.0: Se quema lento (Reserva)
     */
    private readonly BURN_RATES: number[] = [
        1.5, // 0: Frutas
        1.0, // 1: Proteína
        1.2, // 2: Vegetales
        0.8, // 3: Granos
        1.5, // 4: Azúcares
        0.9, // 5: Lácteos
        0.2, // 6: Grasas
    ];

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
            const recentHistory = this._cachedHistory.slice(-10);
            const repeatCount = recentHistory.filter((id) => id === foodId).length;
            const penalty = repeatCount * 0.1;
            varietyMultiplier = Math.max(0.2, 1.0 - penalty);
        }

        if (this._cachedDiet) {
            for (let i = 0; i < 7; i++) {
                const effectiveGain = nutrients[i] * varietyMultiplier;

                let newValue = this._cachedDiet[i] + effectiveGain;
                if (newValue > MAX_SATURATION) newValue = MAX_SATURATION;
                this._cachedDiet[i] = parseFloat(newValue.toFixed(4));
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
        return [...(this._cachedDiet ?? [0, 0, 0, 0, 0, 0, 0])];
    }

    /**
     * Aplica la digestión metabólica dinámica considerando actividad física.
     * @param baseAmount Cantidad base (ya afectada por clima/tiempo)
     */
    public digest(baseAmount: number): void {
        if (!this._cachedDiet) return;

        let activityMultiplier = 1.0;

        if (ADDON.enablePhysicalActivityDietImpact) {
            try {
                if (this.player.isSprinting) {
                    activityMultiplier = 3.5;
                } else if (this.player.isSwimming) {
                    activityMultiplier = 2.5;
                } else if (this.player.isClimbing) {
                    activityMultiplier = 2.0;
                } else if (this.player.isGliding) {
                    activityMultiplier = 1.5;
                } else if (this.player.isSneaking) {
                    activityMultiplier = 0.8;
                } else if (this.player.isSleeping) {
                    activityMultiplier = 0.2;
                }
            } catch (e) {
                logger.error('Error al calcular la actividad', e, 'PlayerDiet.digest');
            }
        }

        const finalBurnAmount = baseAmount * activityMultiplier;

        let hasChanged = false;

        const sugarLevel = this._cachedDiet[4];
        const grainLevel = this._cachedDiet[3];
        const fatLevel = this._cachedDiet[6];
        const hasFastEnergy = sugarLevel + grainLevel > 0.3;

        const isHighIntensity = activityMultiplier > 2.0;

        for (let i = 0; i < 7; i++) {
            let currentValue = this._cachedDiet[i];
            if (currentValue <= 0) continue;

            let rate = this.BURN_RATES[i];
            if (currentValue > 0.8) {
                rate *= 0.5;
            } else if (currentValue < 0.2) {
                rate *= 1.2;
            }
            if (hasFastEnergy && (i === 6 || i === 1)) {
                rate *= 0.1;
            }
            if (isHighIntensity) {
                if (i === 0 || i === 4) {
                    rate *= 1.5;
                }
            }
            if (i === 4 && fatLevel < 0.1) {
                rate *= 2.0;
            }

            const drop = finalBurnAmount * rate;
            this._cachedDiet[i] = Math.max(0, currentValue - drop);
            hasChanged = true;
        }

        if (hasChanged) {
            this._cachedDiet = this._cachedDiet.map((v) => parseFloat(v.toFixed(4))) as Nutrition;
            this.isDirty = true;
        }
    }
}
