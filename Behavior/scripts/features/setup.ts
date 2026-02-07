import { EquipmentSlot, Player, system, world } from '@minecraft/server';
import farmland from './agriculture_update/blocks/Farmland';
import betterComposter from './agriculture_update/blocks/BetterComposter';
import baseCrops from './agriculture_update/blocks/crops/baseCrops';
import { logger, safeExecute } from '../utils/ErrorHandler';
import './agriculture_update/items/CropInspector';
import './agriculture_update/items/InteractionControl';
import { DietRegister } from './agriculture_update/diet/register';
import { weatherManager } from './agriculture_update/environment/WeatherManager';
import { CropInspectorHandler } from './agriculture_update/items/CropInspector';
import { DietBookHandler } from './agriculture_update/items/DietBook';

interface ItemHandler {
    itemTrigger: string;
    execute: (player: Player) => unknown;
}
const ITEM_LOOP_INTERVAL = 8;
const ITEM_HANDLERS: ItemHandler[] = [CropInspectorHandler, DietBookHandler];

system.beforeEvents.startup.subscribe((event) => {
    const result = safeExecute(() => {
        event.blockComponentRegistry.registerCustomComponent(farmland.id, farmland.component);
        event.blockComponentRegistry.registerCustomComponent(
            betterComposter.id,
            betterComposter.component,
        );
        baseCrops.forEach((entry) => {
            event.blockComponentRegistry.registerCustomComponent(entry.id, entry.toProxy());
            logger.debug(`Registered component: ${entry.id}`, 'Startup');
        });
    }, 'ComponentRegistration');

    if (!result.success) {
        logger.error('Failed to register block components', result.error, 'Startup');
    }
});

world.afterEvents.worldLoad.subscribe(() => {
    weatherManager.init();
    DietRegister();

    system.runInterval(() => {
        for (const player of world.getAllPlayers()) {
            try {
                const equipment = player.getComponent('minecraft:equippable');
                const mainHand = equipment?.getEquipment(EquipmentSlot.Mainhand);

                for (const handler of ITEM_HANDLERS) {
                    if (mainHand?.typeId === handler.itemTrigger) {
                        handler.execute(player);
                    }
                }
            } catch (e) {
                logger.error('Error en intervalo', e, 'ItemsInterval');
            }
        }
    }, ITEM_LOOP_INTERVAL);
});
