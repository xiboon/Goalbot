import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    EmbedBuilder,
    StringSelectMenuInteraction
} from 'discord.js';
import type { GoalBot } from '../classes/GoalBot';
import type { Goal } from '../types/Database';
import { roundToDecimal } from './roundToDecimal.js';
export async function createGoalEmbed(
    client: GoalBot,
    interaction:
        | ChatInputCommandInteraction
        | ButtonInteraction
        | StringSelectMenuInteraction,
    goal: Goal,
    currency?: string
) {
    try {
        if (!currency) ({ currency } = await client.manager.getUser(interaction.user.id));
    } catch (e) {
        // Eslint shut up
    }
    const percentage = goal.amount_saved / goal.amount;
    const goalAuthor = await client.users.fetch(goal.user_id);
    return new EmbedBuilder()
        .setAuthor({
            name: goalAuthor.tag || 'Unknown User',
            iconURL: goalAuthor.displayAvatarURL() || ''
        })
        .setTitle(`${goal.goal}`)
        .setDescription(goal.description)
        .addFields(
            {
                name: 'Amount saved',
                value: `${roundToDecimal(
                    goal.amount_saved * client.currencies[currency],
                    2
                )} ${currency}`,
                inline: true
            },
            {
                name: 'Goal',
                value: `${roundToDecimal(
                    goal.amount * client.currencies[currency],
                    2
                )} ${currency}`,
                inline: true
            }
        )
        .setFooter({
            text: `${'▓'.repeat(percentage * 33).padEnd(33, '░')} ${roundToDecimal(
                percentage * 100,
                2
            )}%`
        });
}
