import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    StringSelectMenuBuilder
} from 'discord.js';
import { GoalBot } from '../../classes/GoalBot';
export async function run(client: GoalBot, interaction: ChatInputCommandInteraction) {
    const goals = (await client.manager.listGoals(interaction.user.id)).map(goal => ({
        label: goal.goal,
        value: goal.id.toString(),
        description: goal.description
    }));

    if (!goals.length)
        return interaction.reply({ content: 'You have no goals!', ephemeral: true });

    const component = new StringSelectMenuBuilder()
        .setPlaceholder('Select goals to add.')
        .setCustomId('createGroup')
        .setMaxValues(goals.length)
        .addOptions(goals);
    interaction.reply({
        content: 'Select the goals you want to add to the group.',
        components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(component)
        ],
        ephemeral: true
    });
}
export const data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Start the group creation process.');
