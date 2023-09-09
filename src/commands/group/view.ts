import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';
import { GoalBot } from '../../classes/GoalBot';
import { createGroupEmbed } from '../../utils/createGroupEmbed.js';

export async function run(client: GoalBot, interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name', true);
    const group = await client.manager.getGroup(interaction.user.id, name);
    if (!group)
        return interaction.reply({
            content: 'You do not have a group with this name.',
            ephemeral: true
        });
    const embed = await createGroupEmbed(client, group);
    interaction.reply({ embeds: [embed] });
}
export async function autocomplete(
    client: GoalBot,
    interaction: AutocompleteInteraction
) {
    const focused = interaction.options.getFocused(true);
    const groups = (await client.manager.listGroups(interaction.user.id)).map(group => ({
        name: group.name,
        value: group.name
    }));
    return interaction.respond(groups.filter(e => e.name.startsWith(focused.value)));
}
export const data = new SlashCommandSubcommandBuilder()
    .setName('view')
    .setDescription('View a goal.')
    .addStringOption(option =>
        option
            .setName('name')
            .setDescription('The name of the goal.')
            .setAutocomplete(true)
            .setRequired(true)
    );
