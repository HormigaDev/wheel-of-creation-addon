import { RawMessage, Player } from '@minecraft/server';
import { getBiomeTemperature } from '../../../config';
import { findHandler } from './inspector/index';
import { InspectorContext } from './inspector/types';

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

export const CropInspectorHandler = {
    itemTrigger: 'woc:crop_inspector',
    execute(player: Player) {
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
    },
};
