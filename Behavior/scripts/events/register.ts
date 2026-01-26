import { world, system } from '@minecraft/server';
import components from '../components';

const ARABLE_BLOCKS: string[] = [
    'minecraft:grass_block',
    'minecraft:dirt',
    'minecraft:dirt_with_roots',
    'minecraft:grass_path',
];

system.beforeEvents.startup.subscribe((event) => {
    components.forEach((entry) => {
        event.blockComponentRegistry.registerCustomComponent(entry.id, entry.component);
    });
});

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    const { block, itemStack } = event;
    if (!itemStack) return;

    const isHoe = itemStack.typeId.includes('_hoe');
    const isArable = ARABLE_BLOCKS.includes(block.typeId);

    if (isHoe && isArable) {
        event.cancel = true;
    }
});
