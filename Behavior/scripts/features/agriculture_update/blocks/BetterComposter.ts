import {
    Block,
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    EquipmentSlot,
    GameMode,
    ItemStack,
    Player,
    EntityEquippableComponent,
} from '@minecraft/server';
import { safeExecute } from '../../../utils/ErrorHandler';

type CompostType = 'green' | 'brown';

interface CompostState {
    green: number;
    brown: number;
    level: number;
}

interface MaterialConfig {
    type: CompostType;
    particle: string;
    sound: string;
}

const CONFIG: Record<CompostType, MaterialConfig> = {
    green: {
        type: 'green',
        particle: 'minecraft:villager_happy',
        sound: 'block.composter.fill_success',
    },
    brown: {
        type: 'brown',
        particle: 'minecraft:mycelium_dust_particle',
        sound: 'block.composter.fill_success',
    },
};

const MATERIAL_REGISTRY: Record<string, { type: CompostType; chance: number }> = {};

function registerMaterials(type: CompostType, chance: number, items: string[]) {
    items.forEach((id) => (MATERIAL_REGISTRY[id] = { type, chance }));
}

registerMaterials('green', 1.0, [
    'minecraft:melon_block',
    'minecraft:pumpkin',
    'minecraft:hay_block',
    'minecraft:cake',
]);
registerMaterials('brown', 1.0, [
    'minecraft:mushroom_stem',
    'minecraft:brown_mushroom_block',
    'minecraft:red_mushroom_block',
]);

registerMaterials('green', 0.85, [
    'minecraft:wheat',
    'minecraft:carrot',
    'minecraft:potato',
    'minecraft:beetroot',
    'minecraft:melon_slice',
    'minecraft:cactus',
    'minecraft:vine',
    'minecraft:lily_pad',
    'minecraft:leaves',
    'minecraft:leaves2',
    'minecraft:pale_oak_leaves',
    'minecraft:mangrove_leaves',
    'minecraft:cherry_leaves',
    'woc:carrot',
    'woc:potato',
    'woc:straw',
]);
registerMaterials('brown', 0.85, [
    'minecraft:brown_mushroom',
    'minecraft:red_mushroom',
    'minecraft:coarse_dirt',
    'minecraft:podzol',
    'minecraft:deadbush',
]);

const LOW_TIER_GREEN = [
    'minecraft:wheat_seeds',
    'minecraft:beetroot_seeds',
    'minecraft:melon_seeds',
    'minecraft:pumpkin_seeds',
    'minecraft:pitcher_pod',
    'minecraft:torchflower_seeds',
    'minecraft:grass',
    'minecraft:fern',
    'woc:wheat_seeds',
    'woc:beetroot_seeds',
    'woc:pumpkin_seeds',
    'woc:melon_seeds',
    'minecraft:kelp',
];
const LOW_TIER_BROWN = [
    'minecraft:stick',
    'minecraft:hanging_roots',
    'minecraft:dirt_with_roots',
    'minecraft:dried_kelp',
    'minecraft:mangrove_roots',
];

registerMaterials('green', 0.5, LOW_TIER_GREEN);
registerMaterials('brown', 0.5, LOW_TIER_BROWN);

const ACTIVATOR_ITEM = 'minecraft:bone_meal';

export class BetterComposter implements BlockCustomComponent {
    onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
        safeExecute(() => this.handleInteract(e), 'BetterComposter.Interact');
    }

    private handleInteract(e: BlockComponentPlayerInteractEvent) {
        const { block, player } = e;
        if (!player) return;

        const equipment = player.getComponent('minecraft:equippable') as EntityEquippableComponent;
        const itemStack = equipment?.getEquipment(EquipmentSlot.Mainhand);

        if (!itemStack) return;

        const state: CompostState = {
            green: (block.permutation.getState('woc:green' as any) as number) ?? 0,
            brown: (block.permutation.getState('woc:brown' as any) as number) ?? 0,
            level: (block.permutation.getState('woc:level' as any) as number) ?? 0,
        };

        if (itemStack.typeId === ACTIVATOR_ITEM) {
            this.tryHarvest(block, player, equipment, itemStack, state);
            return;
        }

        const materialInfo = MATERIAL_REGISTRY[itemStack.typeId];

        if (materialInfo) {
            const currentLevel = state[materialInfo.type];
            if (currentLevel < 4) {
                this.processInput(block, player, equipment, itemStack, state, materialInfo);
            } else {
                block.dimension.playSound('block.chest.locked', block.location, {
                    volume: 0.5,
                    pitch: 1.5,
                });
            }
        }
    }

    /**
     * Procesa la entrada de cualquier material (verde o marrón)
     */
    private processInput(
        block: Block,
        player: Player,
        equipment: EntityEquippableComponent,
        item: ItemStack,
        state: CompostState,
        info: { type: CompostType; chance: number },
    ) {
        this.consumeItem(player, equipment, item);

        const success = Math.random() < info.chance;

        if (!success) {
            block.dimension.playSound('block.composter.fill', block.location, { pitch: 1.0 });
            block.dimension.spawnParticle('minecraft:basic_smoke_particle', block.center());
            return;
        }

        const config = CONFIG[info.type];
        const nextVal = state[info.type] + 1;

        const otherVal = info.type === 'green' ? state.brown : state.green;
        const newLevel = Math.min(nextVal, otherVal);

        const perm = block.permutation
            .withState(`woc:${info.type}` as any, nextVal)
            .withState('woc:level' as any, newLevel);

        block.setPermutation(perm);

        block.dimension.playSound(config.sound, block.location, { pitch: 0.8 + nextVal * 0.1 });

        const yOffset = 0.2 + Math.max(nextVal, otherVal) * 0.15;
        block.dimension.spawnParticle(config.particle, {
            x: block.center().x,
            y: block.location.y + yOffset,
            z: block.center().z,
        });
    }

    private tryHarvest(
        block: Block,
        player: Player,
        equipment: EntityEquippableComponent,
        activator: ItemStack,
        state: CompostState,
    ) {
        if (state.green < 4 || state.brown < 4) {
            block.dimension.playSound('block.chest.locked', block.location, {
                volume: 0.5,
                pitch: 0.5,
            });
            return;
        }

        this.consumeItem(player, equipment, activator);

        const perm = block.permutation
            .withState('woc:green' as any, 0)
            .withState('woc:brown' as any, 0)
            .withState('woc:level' as any, 0);
        block.setPermutation(perm);

        const amount = Math.floor(Math.random() * 5) + 4;
        block.dimension.spawnItem(new ItemStack('woc:fertilizer', amount), block.center());

        block.dimension.playSound('block.composter.ready', block.location);
    }

    private consumeItem(player: Player, equipment: EntityEquippableComponent, item: ItemStack) {
        if (player.getGameMode() === GameMode.Creative) return;

        if (item.amount > 1) {
            item.amount--;
            equipment.setEquipment(EquipmentSlot.Mainhand, item);
        } else {
            equipment.setEquipment(EquipmentSlot.Mainhand, undefined);
        }
    }

    toProxy(): BlockCustomComponent {
        return {
            onPlayerInteract: this.onPlayerInteract.bind(this),
        };
    }
}

export default {
    id: 'woc:better_composter_logic',
    component: new BetterComposter().toProxy(),
};
