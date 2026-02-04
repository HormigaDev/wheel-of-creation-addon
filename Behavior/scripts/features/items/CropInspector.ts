import { system, world, EquipmentSlot, RawMessage } from '@minecraft/server';
import { getBiomeTemperature } from '../../config';
import { findHandler } from './inspector/index';
import { InspectorContext } from './inspector/types';
import { logger } from '../../utils/ErrorHandler';

const INSPECTOR_ITEM_ID = 'woc:crop_inspector';

/**
 * Construye la información base del bioma que siempre se muestra
 */
function buildBiomeHeader(biomeName: string, temperature: number): (RawMessage | string)[] {
    return [
        { translate: 'woc.inspector.biome' },
        ' ',
        { translate: `woc.biome.${biomeName}` },
        '   ',
        { translate: 'woc.inspector.temp_fmt', with: [temperature.toString()] },
    ];
}

/**
 * Loop principal del inspector de cultivos
 */
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        try {
            const equipment = player.getComponent('minecraft:equippable');
            const mainHand = equipment?.getEquipment(EquipmentSlot.Mainhand);

            if (mainHand?.typeId !== INSPECTOR_ITEM_ID) continue;

            const currentBiome = player.dimension.getBiome(player.location);
            const playerTemp = getBiomeTemperature(currentBiome.id, player.location);
            const biomeName = currentBiome.id.replace('minecraft:', '');

            const components: (RawMessage | string)[] = buildBiomeHeader(biomeName, playerTemp);

            const hit = player.getBlockFromViewDirection({ maxDistance: 6 });

            if (hit) {
                const block = hit.block;
                const handler = findHandler(block);

                if (handler) {
                    const ctx: InspectorContext = {
                        block,
                        biomeId: currentBiome.id,
                        temperature: playerTemp,
                    };

                    const blockComponents = handler.getDisplayComponents(ctx);
                    components.push(...blockComponents);
                }
            }

            player.onScreenDisplay.setActionBar(components);
        } catch (error) {
            logger.error(
                'Error al mostrar información del inspector de cultivos',
                error,
                'CropInspector',
            );
        }
    }
}, 4);
