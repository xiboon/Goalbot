import { SlashCommandSubcommandBuilder } from 'discord.js';
import { GoalBot } from '../../classes/GoalBot';

export async function run(client: GoalBot, interaction) {
    const goal = interaction.options.getString('goal', true);
    const goalData = await client.manager.getGoal(interaction.user.id, goal);
    if (!goalData)
        return interaction.reply({
            ephemeral: true,
            content: 'No goal found under this name.'
        });
    await client.manager.deleteGoal(goalData);
    interaction.reply({
        content: 'Deleted your goal.',
        ephemeral: true
    });
}
export async function autocomplete(client, interaction) {
    const focused = interaction.options.getFocused(true);
    const goals = await client.manager.listGoals(interaction.user.id);
    const values = goals
        .filter(e => e.goal.startsWith(focused.value))
        .map(e => ({
            name: e.goal,
            value: e.goal
        }));
    interaction.respond(values);
}
export const data = new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription('Delete a goal.')
    .addStringOption(option =>
        option
            .setName('goal')
            .setDescription('The goal to delete.')
            .setAutocomplete(true)
            .setRequired(true)
    );
