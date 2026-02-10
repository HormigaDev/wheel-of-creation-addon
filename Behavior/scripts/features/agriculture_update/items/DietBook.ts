import { Player } from '@minecraft/server';
import { PLAYERS_DIET } from '../diet/register';
import { TextColor } from '../../../utils/TextColor';

export const DietBookHandler = {
    itemTrigger: 'woc:diet_book',
    execute(player: Player) {
        const playerDiet = PLAYERS_DIET.get(player.id);
        if (!playerDiet) return;

        // [frutas, proteinas, vegetales, granos, azúcares, lácteos, grasas]
        const [fruits, proteins, vegetables, grains, sugars, dairy, fats] = playerDiet.getStats();

        const label = [
            TextColor.red(''),
            { translate: 'woc.diet.fruits' },
            ': ',
            fruits + '%   ',
            TextColor.gold(''),
            { translate: 'woc.diet.proteins' },
            ': ',
            proteins + '%   ',
            TextColor.green(''),
            { translate: 'woc.diet.vegetables' },
            ': ',
            vegetables + '%   ',
            TextColor.yellow(''),
            { translate: 'woc.diet.grains' },
            ': ',
            grains + '%   \n          ',
            TextColor.lightPurple(''),
            { translate: 'woc.diet.sugars' },
            ': ',
            sugars + '%   ',
            TextColor.bold(''),
            TextColor.white(''),
            { translate: 'woc.diet.dairy' },
            ': ',
            dairy + '%   ',
            TextColor.reset(''),
            TextColor.gray(''),
            { translate: 'woc.diet.fats' },
            ': ',
            fats + '%',
        ];

        player.onScreenDisplay.setActionBar(label);
    },
};
