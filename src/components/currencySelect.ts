import { StringSelectMenuInteraction } from 'discord.js';
import { GoalBot } from '../classes/GoalBot';
import { createGoalEmbed } from '../utils/createGoalEmbed.js';

export async function run(client: GoalBot, interaction: StringSelectMenuInteraction) {
    const [, id, userId] = interaction.customId.split('.');
    const goalData = await client.manager.getGoalById(userId, parseInt(id));
    const { values } = interaction;
    const embed = await createGoalEmbed(client, interaction, goalData, values[0]);
    interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
}
