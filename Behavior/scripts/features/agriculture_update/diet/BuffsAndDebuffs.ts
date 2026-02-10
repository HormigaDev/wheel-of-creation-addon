import {
    Player,
    EntityComponentTypes,
    EntityHealthComponent,
    world,
    system,
} from '@minecraft/server';
import { Nutrition, ADDON } from '../../../config';
import { logger } from '../../../utils/ErrorHandler';
import { PLAYERS_DIET } from './register';

const I_FRUIT = 0;
const I_PROTEIN = 1;
const I_VEGETABLE = 2;
const I_GRAIN = 3;
const I_SUGAR = 4;
const I_DAIRY = 5;
const I_FAT = 6;

const DP_DAMAGE_MULT = 'woc:damage_multiplier';
const DP_RESISTANCE_MULT = 'woc:resistance_multiplier';
const DP_HEALTH_TIER = 'woc:health_tier';

const BASE_HEALTH = 20;
const MAX_HEALTH = 40;
const MIN_HEALTH = 10;

const DEBUFF_THRESHOLD = 0.2;
const BUFF_LOW = 0.65;
const BUFF_HIGH = 0.85;

const MIN_DAMAGE_MULT = 0.6;
const MAX_DAMAGE_MULT = 1.6;
const MIN_RESISTANCE_MULT = 0.6;
const MAX_RESISTANCE_MULT = 1.4;
const BASE_MULTIPLIER = 1.0;

const HEALTH_TIERS = [10, 14, 18, 20, 24, 28, 32, 36, 40];

const COMBAT_CAUSES = new Set(['entityAttack', 'projectile', 'entityExplosion', 'thorns']);

function snapToHealthTier(value: number): number {
    let closest = HEALTH_TIERS[0];
    let minDiff = Math.abs(value - closest);
    for (const tier of HEALTH_TIERS) {
        const diff = Math.abs(value - tier);
        if (diff < minDiff) {
            minDiff = diff;
            closest = tier;
        }
    }
    return closest;
}

/**
 * Sistema centralizado de buffs/debuffs basado en la dieta del jugador.
 *
 * Stats modificados:
 *   1. Vida Máxima → component groups en player.json (10–40)
 *   2. Daño         → multiplicador sobre daño infligido (dynamic property)
 *   3. Resistencia  → multiplicador sobre daño recibido (dynamic property)
 *
 * Los debuffs solo aplican a: Frutas, Proteína, Vegetales, Granos, Azúcares.
 * Lácteos y Grasas NUNCA causan debuffs (solo contribuyen a buffs).
 */
export class BuffsAndDebuffs {
    /** Inicializa al jugador. Si no tiene datos previos, dieta al 50%. */
    static initPlayer(player: Player): void {
        const pd = PLAYERS_DIET.get(player.id);
        if (!pd) return;

        const diet = pd.getRawDiet();
        if (!diet) return;

        const isEmpty = diet.every((v) => v <= 0);
        if (isEmpty) {
            for (let i = 0; i < 7; i++) {
                diet[i] = 0.5;
            }
            pd.markDirty();
            pd.save();
        }

        if (player.getDynamicProperty(DP_DAMAGE_MULT) === undefined) {
            player.setDynamicProperty(DP_DAMAGE_MULT, BASE_MULTIPLIER);
        }
        if (player.getDynamicProperty(DP_RESISTANCE_MULT) === undefined) {
            player.setDynamicProperty(DP_RESISTANCE_MULT, BASE_MULTIPLIER);
        }
        if (player.getDynamicProperty(DP_HEALTH_TIER) === undefined) {
            player.setDynamicProperty(DP_HEALTH_TIER, BASE_HEALTH);
        }

        this.evaluate(player);
    }

    /** Evalúa la dieta del jugador y aplica buffs/debuffs. */
    static evaluate(player: Player): void {
        if (!player || !player.isValid) return;

        const pd = PLAYERS_DIET.get(player.id);
        if (!pd) return;

        const diet = pd.getRawDiet();
        if (!diet) return;

        try {
            const targetHealth = this.calcHealthTarget(diet);
            const damageMult = this.calcDamageMultiplier(diet);
            const resistMult = this.calcResistanceMultiplier(diet);

            this.applyHealth(player, targetHealth);
            this.applyDamageMultiplier(player, damageMult);
            this.applyResistanceMultiplier(player, resistMult);
        } catch (e) {
            logger.error('Error al evaluar buffs', e, 'BuffsAndDebuffs.evaluate');
        }
    }

    /**
     * Factor de balance dietético.
     * Evalúa si las categorías complementarias (no primarias del buff)
     * están por encima del umbral de 0.5. Si el jugador descuida el resto
     * de su dieta, el buff pierde eficacia de forma suave (smoothstep).
     *
     * Ejemplo: proteína al 90% pero el resto al 30% → factor ≈ 0.22
     *          proteína al 90% y resto al 55% → factor = 1.0
     *
     * Usa smoothstep (3t²−2t³) para una curva profesional, no lineal.
     */
    private static calcBalanceFactor(diet: Nutrition, primaryIndices: number[]): number {
        let sum = 0;
        let count = 0;
        for (let i = 0; i < 7; i++) {
            // Saltar las categorías primarias del buff que estamos calculando
            let isPrimary = false;
            for (let p = 0; p < primaryIndices.length; p++) {
                if (primaryIndices[p] === i) {
                    isPrimary = true;
                    break;
                }
            }
            if (isPrimary) continue;
            sum += diet[i];
            count++;
        }
        if (count === 0) return 1.0;
        const avg = sum / count;
        if (avg >= 0.5) return 1.0;
        // smoothstep: transición suave de 0 a 1 en rango [0, 0.5]
        const t = avg / 0.5; // normalizar a [0, 1]
        return t * t * (3.0 - 2.0 * t);
    }

    /**
     * Escala un score bruto aplicando BUFF_LOW/BUFF_HIGH para obtener
     * un valor de progresión entre 0 y 1 (0 = sin buff, 1 = buff máximo).
     */
    private static calcBuffProgression(score: number): number {
        if (score < BUFF_LOW) return 0;
        if (score < BUFF_HIGH) {
            const t = (score - BUFF_LOW) / (BUFF_HIGH - BUFF_LOW);
            return t * 0.7;
        }
        const t = (score - BUFF_HIGH) / (1.0 - BUFF_HIGH);
        return 0.7 + t * 0.3;
    }

    /**
     * Calcula la vida máxima objetivo.
     * El score ponderado se multiplica por el factor de balance:
     * si las categorías complementarias están bajas, el buff se suprime.
     */
    private static calcHealthTarget(diet: Nutrition): number {
        const rawScore =
            diet[I_SUGAR] * 0.3 +
            diet[I_FRUIT] * 0.25 +
            diet[I_VEGETABLE] * 0.2 +
            diet[I_GRAIN] * 0.15 +
            diet[I_DAIRY] * 0.05 +
            diet[I_FAT] * 0.05;

        if (ADDON.enableDietDebuffs && rawScore < DEBUFF_THRESHOLD) {
            const t = rawScore / DEBUFF_THRESHOLD;
            return MIN_HEALTH + t * (BASE_HEALTH - MIN_HEALTH);
        }

        const balance = this.calcBalanceFactor(diet, [I_SUGAR, I_FRUIT]);
        const score = rawScore * balance;
        const progression = this.calcBuffProgression(score);
        return BASE_HEALTH + progression * (MAX_HEALTH - BASE_HEALTH);
    }

    /** Calcula el multiplicador de daño infligido. */
    private static calcDamageMultiplier(diet: Nutrition): number {
        const rawScore =
            diet[I_PROTEIN] * 0.4 +
            diet[I_GRAIN] * 0.25 +
            diet[I_FRUIT] * 0.15 +
            diet[I_SUGAR] * 0.1 +
            diet[I_VEGETABLE] * 0.1;

        if (ADDON.enableDietDebuffs && rawScore < DEBUFF_THRESHOLD) {
            const t = rawScore / DEBUFF_THRESHOLD;
            return MIN_DAMAGE_MULT + t * (BASE_MULTIPLIER - MIN_DAMAGE_MULT);
        }

        const balance = this.calcBalanceFactor(diet, [I_PROTEIN, I_GRAIN]);
        const score = rawScore * balance;
        const progression = this.calcBuffProgression(score);
        return BASE_MULTIPLIER + progression * (MAX_DAMAGE_MULT - BASE_MULTIPLIER);
    }

    /**
     * Calcula el multiplicador de daño recibido (menor = más resistente).
     * Grasas y Lácteos son los principales nutrientes de resistencia.
     * Más grasa = más masa corporal para absorber impactos.
     */
    private static calcResistanceMultiplier(diet: Nutrition): number {
        const rawBuffScore =
            diet[I_FAT] * 0.35 +
            diet[I_DAIRY] * 0.25 +
            diet[I_PROTEIN] * 0.2 +
            diet[I_GRAIN] * 0.1 +
            diet[I_VEGETABLE] * 0.1;

        // Para debuffs solo cuentan nutrientes que no sean lácteos/grasas
        if (ADDON.enableDietDebuffs) {
            const debuffScore =
                diet[I_PROTEIN] * 0.35 +
                diet[I_GRAIN] * 0.25 +
                diet[I_VEGETABLE] * 0.2 +
                diet[I_FRUIT] * 0.1 +
                diet[I_SUGAR] * 0.1;
            if (debuffScore < DEBUFF_THRESHOLD) {
                const t = debuffScore / DEBUFF_THRESHOLD;
                return MAX_RESISTANCE_MULT - t * (MAX_RESISTANCE_MULT - BASE_MULTIPLIER);
            }
        }

        const balance = this.calcBalanceFactor(diet, [I_FAT, I_DAIRY]);
        const score = rawBuffScore * balance;
        const progression = this.calcBuffProgression(score);
        return BASE_MULTIPLIER - progression * (BASE_MULTIPLIER - MIN_RESISTANCE_MULT);
    }

    /**
     * Aplica la vida máxima usando triggerEvent sobre los component groups
     * definidos en player.json. Preserva la vida actual del jugador.
     */
    private static applyHealth(player: Player, targetMaxHealth: number): void {
        try {
            const tier = snapToHealthTier(targetMaxHealth);
            const currentTier =
                (player.getDynamicProperty(DP_HEALTH_TIER) as number) ?? BASE_HEALTH;

            if (tier === currentTier) return;

            // Guardar HP actual antes del cambio
            const healthComp = player.getComponent(EntityComponentTypes.Health) as
                | EntityHealthComponent
                | undefined;
            const currentHp = healthComp?.currentValue ?? BASE_HEALTH;

            // Disparar el evento para cambiar la vida máxima
            if (tier === BASE_HEALTH) {
                player.triggerEvent('woc:reset_health');
            } else {
                player.triggerEvent(`woc:set_health_${tier}`);
            }

            player.setDynamicProperty(DP_HEALTH_TIER, tier);

            // Restaurar HP en el siguiente tick (después de que el component group se aplique)
            system.run(() => {
                try {
                    if (!player.isValid) return;
                    const comp = player.getComponent(EntityComponentTypes.Health) as
                        | EntityHealthComponent
                        | undefined;
                    if (!comp) return;
                    comp.setCurrentValue(Math.min(currentHp, comp.effectiveMax));
                } catch (_) {
                    /* jugador puede haber muerto */
                }
            });
        } catch (e) {
            logger.error('Error al aplicar vida', e, 'BuffsAndDebuffs.applyHealth');
        }
    }

    private static applyDamageMultiplier(player: Player, multiplier: number): void {
        const clamped = Math.max(MIN_DAMAGE_MULT, Math.min(MAX_DAMAGE_MULT, multiplier));
        player.setDynamicProperty(DP_DAMAGE_MULT, Math.round(clamped * 100) / 100);
    }

    private static applyResistanceMultiplier(player: Player, multiplier: number): void {
        const clamped = Math.max(MIN_RESISTANCE_MULT, Math.min(MAX_RESISTANCE_MULT, multiplier));
        player.setDynamicProperty(DP_RESISTANCE_MULT, Math.round(clamped * 100) / 100);
    }

    static getDamageMultiplier(player: Player): number {
        return (player.getDynamicProperty(DP_DAMAGE_MULT) as number) ?? BASE_MULTIPLIER;
    }

    static getResistanceMultiplier(player: Player): number {
        return (player.getDynamicProperty(DP_RESISTANCE_MULT) as number) ?? BASE_MULTIPLIER;
    }

    /**
     * Registra la intercepción de daño. Un solo handler en entityHurt
     * que combina el multiplicador de ataque del agresor y la resistencia del objetivo.
     * Solo procesa causas de combate para evitar loops infinitos con applyDamage.
     */
    static registerDamageEvents(): void {
        world.afterEvents.entityHurt.subscribe((e) => {
            try {
                const { damage, hurtEntity, damageSource } = e;
                const cause = damageSource.cause as string;

                // Solo interceptar daño de combate (entityAttack, projectile, etc.)
                // applyDamage() sin opciones usa cause 'none', evitando el loop
                if (!COMBAT_CAUSES.has(cause)) return;

                const attacker = damageSource.damagingEntity;
                let attackMult = BASE_MULTIPLIER;
                let resistMult = BASE_MULTIPLIER;

                // Multiplicador de ataque del agresor (si es jugador)
                if (attacker?.typeId === 'minecraft:player') {
                    attackMult = this.getDamageMultiplier(attacker as Player);
                }

                // Multiplicador de resistencia de la víctima (si es jugador)
                if (hurtEntity?.typeId === 'minecraft:player') {
                    resistMult = this.getResistanceMultiplier(hurtEntity as Player);
                }

                const totalMult = attackMult * resistMult;
                if (Math.abs(totalMult - BASE_MULTIPLIER) < 0.01) return;

                const delta = damage * (totalMult - BASE_MULTIPLIER);
                if (!hurtEntity.isValid) return;

                system.run(() => {
                    try {
                        if (!hurtEntity.isValid) return;

                        if (delta > 0) {
                            // Más daño (buff de ataque del agresor o debuff de resistencia)
                            hurtEntity.applyDamage(delta);
                        } else {
                            // Menos daño (buff de resistencia o debuff de ataque)
                            const comp = hurtEntity.getComponent(EntityComponentTypes.Health) as
                                | EntityHealthComponent
                                | undefined;
                            if (!comp) return;
                            const newHp = Math.min(
                                comp.currentValue + Math.abs(delta),
                                comp.effectiveMax,
                            );
                            comp.setCurrentValue(newHp);
                        }
                    } catch (_) {
                        /* entidad pudo haber muerto */
                    }
                });
            } catch (e) {
                logger.error('Error en intercepción de daño', e, 'BuffsAndDebuffs.entityHurt');
            }
        });
    }
}
