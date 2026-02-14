import { EntityComponentTypes, EquipmentSlot, Player, system, world } from '@minecraft/server';
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
import { FOOD_MAP, FOOD_PROPERTIES } from '../config';
import { TextColor } from '../utils/TextColor';

const DIET_BOOK_ITEM_ID = 'woc:diet_book';

interface ItemHandler {
    itemTrigger: string;
    execute: (player: Player) => unknown;
}
const ITEM_LOOP_INTERVAL = 4;
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
                if (!mainHand) continue;

                let inHandler = false;
                for (const handler of ITEM_HANDLERS) {
                    if (mainHand?.typeId === handler.itemTrigger) {
                        handler.execute(player);
                        inHandler = true;
                    }
                }
                if (inHandler) continue;

                const foodId = FOOD_MAP.getByKey(mainHand.typeId);
                if (foodId && checkPlayerHasItem(player, DIET_BOOK_ITEM_ID)) {
                    const stats = FOOD_PROPERTIES.get(foodId);
                    if (!stats) continue;

                    const STAT_DEFS: {
                        index: number;
                        key: string;
                        color: (t: string) => string;
                    }[] = [
                        { index: 0, key: 'woc.diet.fruits', color: TextColor.red },
                        { index: 1, key: 'woc.diet.proteins', color: TextColor.gold },
                        { index: 2, key: 'woc.diet.vegetables', color: TextColor.green },
                        { index: 3, key: 'woc.diet.grains', color: TextColor.yellow },
                        { index: 4, key: 'woc.diet.sugars', color: TextColor.darkPurple },
                        {
                            index: 5,
                            key: 'woc.diet.dairy',
                            color: (t: string) => TextColor.bold('') + TextColor.white(t),
                        },
                        { index: 6, key: 'woc.diet.fats', color: TextColor.gray },
                    ];

                    const MAX_PER_LINE = 4;
                    const activeStats = STAT_DEFS.filter((s) => stats[s.index] > 0);
                    if (activeStats.length === 0) continue;

                    const components: (string | { translate: string })[] = [];
                    for (let i = 0; i < activeStats.length; i++) {
                        if (i > 0 && i % MAX_PER_LINE === 0) {
                            components.push('\n');
                        } else if (i > 0) {
                            components.push('   ');
                        }
                        const s = activeStats[i];
                        components.push(s.color(''));
                        components.push({ translate: s.key });
                        components.push(': ' + Math.floor(stats[s.index] * 100) + '%');
                    }

                    player.onScreenDisplay.setActionBar(components);
                }
            } catch (e) {
                logger.error('Error en intervalo', e, 'ItemsInterval');
            }
        }
    }, ITEM_LOOP_INTERVAL);
});

function checkPlayerHasItem(player: Player, itemId: string) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory);

    if (!inventory || !inventory.container) return false;

    const container = inventory.container;

    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);

        if (item && item.typeId === itemId) {
            return true;
        }
    }

    return false;
}
