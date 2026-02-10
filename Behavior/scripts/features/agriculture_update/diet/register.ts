import { getPlayerThermalStats } from '../../../utils/ArmorSystem';
import { getBiomeTemperature, METABOLISM, ADDON } from '../../../config';
import { PlayerDiet } from './PlayerDiet';
import { BuffsAndDebuffs } from './BuffsAndDebuffs';
import { system, world } from '@minecraft/server';

export const PLAYERS_DIET = new Map<string, PlayerDiet>();
const DIGGEST_INTERVAL = 400;
const BUFF_EVAL_INTERVAL = 1200; // Evaluate buffs/debuffs every ~60 seconds

const initPlayer = (player: import('@minecraft/server').Player) => {
    if (!PLAYERS_DIET.has(player.id)) {
        PLAYERS_DIET.set(player.id, new PlayerDiet(player));
    }
    BuffsAndDebuffs.initPlayer(player);
};

export const DietRegister = () => {
    if (ADDON.enableDiet) {
        world.getAllPlayers().forEach(initPlayer);

        world.afterEvents.playerSpawn.subscribe((e) => {
            initPlayer(e.player);
        });

        world.beforeEvents.playerLeave.subscribe((e) => {
            PLAYERS_DIET.delete(e.player.id);
        });

        world.afterEvents.itemCompleteUse.subscribe((e) => {
            const { itemStack, source: player } = e;
            if (!player) return;

            const playerDiet = PLAYERS_DIET.get(player.id);
            if (playerDiet) {
                playerDiet.addFood(itemStack.typeId);
            }
        });

        // Register damage interception events for resistance/damage multipliers
        BuffsAndDebuffs.registerDamageEvents();

        // Digestion interval — round-robin, one nutrient per cycle
        system.runInterval(() => {
            const baseBurn = METABOLISM.BASE_BURN_PER_TICK * DIGGEST_INTERVAL;

            PLAYERS_DIET.forEach((pd) => {
                const player = pd.player;

                if (!player || !player.isValid) return;

                let playerBurn = baseBurn;

                if (ADDON.enableBiomeDietImpact) {
                    const location = player.location;
                    let currentTemp = 20;

                    const biome = player.dimension.getBiome(location);
                    if (biome) {
                        currentTemp = getBiomeTemperature(biome.id, location);
                    }

                    let thermalMultiplier = 1.0;

                    if (currentTemp < METABOLISM.IDEAL_TEMP_MIN) {
                        const diff = METABOLISM.IDEAL_TEMP_MIN - currentTemp;
                        let penalty = diff * METABOLISM.COLD_PENALTY_FACTOR;

                        if (ADDON.enableArmorDietImpact) {
                            const insulation = getPlayerThermalStats(player).insulation;
                            const protection = insulation > 0.9 ? 0.9 : insulation;
                            penalty *= 1.0 - protection;
                        }

                        // Grasas corporales aíslan del frío (efecto hibernación)
                        // Hasta 50% de reducción de penalización con grasa al máximo
                        const diet = pd.getRawDiet();
                        if (diet) {
                            const fatLevel = diet[6]; // I_FAT = 6
                            penalty *= 1.0 - fatLevel * 0.5;
                        }

                        thermalMultiplier += penalty;
                    } else if (currentTemp > METABOLISM.IDEAL_TEMP_MAX) {
                        const diff = currentTemp - METABOLISM.IDEAL_TEMP_MAX;
                        let penalty = diff * METABOLISM.HEAT_PENALTY_FACTOR;

                        if (ADDON.enableArmorDietImpact) {
                            const conductivity = getPlayerThermalStats(player).conductivity;
                            penalty *= 1.0 + conductivity;
                        }

                        thermalMultiplier += penalty;
                    }

                    playerBurn *= thermalMultiplier;
                }

                pd.digest(playerBurn);
                pd.save();
            });
        }, DIGGEST_INTERVAL);

        // Buff/Debuff evaluation interval — less frequent than digestion
        system.runInterval(() => {
            PLAYERS_DIET.forEach((pd) => {
                const player = pd.player;
                if (!player || !player.isValid) return;

                BuffsAndDebuffs.evaluate(player);
            });
        }, BUFF_EVAL_INTERVAL);
    }
};
