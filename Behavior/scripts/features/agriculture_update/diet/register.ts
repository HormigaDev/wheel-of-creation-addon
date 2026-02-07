import { getPlayerThermalStats } from '../../../utils/ArmorSystem';
import { getBiomeTemperature, METABOLISM, ADDON } from '../../../config';
import { PlayerDiet } from './PlayerDiet';
import { system, world } from '@minecraft/server';

const PLAYERS_DIET = new Map<string, PlayerDiet>();
const DIGGEST_INTERVAL = 400; // 20 segundos

if (ADDON.enableDiet) {
    world.afterEvents.playerSpawn.subscribe((e) => {
        const playerDiet = new PlayerDiet(e.player);
        PLAYERS_DIET.set(e.player.id, playerDiet);
    });

    world.beforeEvents.playerLeave.subscribe((e) => {
        PLAYERS_DIET.delete(e.player.id);
    });

    world.afterEvents.itemCompleteUse.subscribe((e) => {
        const { itemStack, source: player } = e;
        const playerDiet = PLAYERS_DIET.get(player.id);
        playerDiet?.addFood(itemStack.typeId);
    });

    system.runInterval(() => {
        let intervalBurn = METABOLISM.BASE_BURN_PER_TICK * DIGGEST_INTERVAL;

        PLAYERS_DIET.forEach((pd) => {
            const player = pd.player;

            if (!player || !player.isValid) return;

            const location = player.location;
            let currentTemp = 20; // Valor default por seguridad

            try {
                const biome = player.dimension.getBiome(location);
                if (biome) {
                    currentTemp = getBiomeTemperature(biome.id, location);
                }
            } catch (e) {}

            if (ADDON.enableBiomeDietImpact) {
                let thermalMultiplier = 1.0;

                if (currentTemp < METABOLISM.IDEAL_TEMP_MIN) {
                    const diff = METABOLISM.IDEAL_TEMP_MIN - currentTemp;
                    let penalty = diff * METABOLISM.COLD_PENALTY_FACTOR;

                    if (ADDON.enableArmorDietImpact) {
                        const protection = Math.min(0.9, getPlayerThermalStats(player).insulation);
                        penalty *= 1.0 - protection;
                    }

                    thermalMultiplier += penalty;
                } else if (currentTemp > METABOLISM.IDEAL_TEMP_MAX) {
                    const diff = currentTemp - METABOLISM.IDEAL_TEMP_MAX;
                    let penalty = diff * METABOLISM.HEAT_PENALTY_FACTOR;

                    if (ADDON.enableArmorDietImpact) {
                        penalty *= 1.0 + getPlayerThermalStats(player).conductivity;
                    }

                    thermalMultiplier += penalty;
                }

                intervalBurn *= thermalMultiplier;
            }

            pd.digest(intervalBurn);
            pd.save();
        });
    }, DIGGEST_INTERVAL);
}
