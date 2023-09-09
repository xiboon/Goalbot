import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';
import { GoalBot } from '../../classes/GoalBot';

export async function run(client: GoalBot, interaction: ChatInputCommandInteraction) {
    const group = await interaction.options.getString('group', true);
    const groupData = await client.manager.getGroup(interaction.user.id, group);
    if (!groupData) {
        return interaction.reply({
            content: `You don't have a group named ${group}!`,
            ephemeral: true
        });
    }
    await client.manager.deleteGroup(interaction.user.id, group);
    return interaction.reply({
        content: `Deleted group ${group}!`,
        ephemeral: true
    });
}
export async function autocomplete(
    client: GoalBot,
    interaction: AutocompleteInteraction
) {
    const groups = await client.manager.listGroups(interaction.user.id);
    const group = await interaction.options.getString('group', true);
    const groupData = groups
        .filter(e => e.name.startsWith(group))
        .map(e => ({ name: e.name, value: e.name }));
    return interaction.respond(groupData);
}
export const data = new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription('Delete a group.')
    .addStringOption(option =>
        option
            .setName('group')
            .setDescription('The name of the group.')
            .setRequired(true)
            .setAutocomplete(true)
    );
