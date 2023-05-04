import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    EmbedBuilder
} from 'discord.js';
import type { GoalBot } from '../classes/GoalBot';
import type { Goal } from '../types/Database';
export async function createGoalEmbed(
    client: GoalBot,
    interaction: ChatInputCommandInteraction | ButtonInteraction,
    goal: Goal,
    currency?: string
) {
    try {
        if (!currency)
            ({ currency } = await client.manager.getUser(interaction.user.id));
    } catch (e) {
        // Eslint shut up
    }
    const goalAuthor = await client.users.fetch(goal.user_id);
    console.log(goal, client.currencies);
    return new EmbedBuilder()
        .setAuthor({
            name: goalAuthor.tag || 'Unknown User',
            iconURL: goalAuthor.displayAvatarURL() || ''
        })
        .setTitle(goal.goal)
        .setDescription(goal.description)
        .addFields(
            {
                name: 'Amount',
                value: `${
                    goal.amount * client.currencies[currency]
                } ${currency}`,
                inline: true
            },
            {
                name: 'Amount Saved',
                value: `${
                    goal.amount_saved * client.currencies[currency]
                } ${currency}`,
                inline: true
            }
        );
}
