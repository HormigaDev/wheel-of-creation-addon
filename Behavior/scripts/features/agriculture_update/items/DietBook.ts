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
            TextColor.red(`F: ${fruits}`),
            TextColor.gold(`P: ${proteins}`),
            TextColor.green(`V: ${vegetables}`),
            TextColor.yellow(`G: ${grains}`),
            TextColor.lightPurple(`S: ${sugars}`),
            TextColor.bold(TextColor.white(`D: ${dairy}`)),
            TextColor.gray(`f: ${fats}%`),
        ].join('%   ');

        player.onScreenDisplay.setActionBar(label);
    },
};
