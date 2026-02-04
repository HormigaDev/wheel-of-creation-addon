import { system } from '@minecraft/server';
import farmland from './blocks/Farmland';
import betterComposter from './blocks/BetterComposter';
import baseCrops from './blocks/crops/baseCrops';
import { logger, safeExecute } from '../utils/ErrorHandler';
import './items/CropInspector';

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
