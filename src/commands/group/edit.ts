import {
    ActionRowBuilder,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ModalBuilder,
    SlashCommandSubcommandBuilder,
    TextInputBuilder,
    TextInputStyle
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
    const modal = new ModalBuilder()
        .setTitle('Edit Group')
        .addComponents([
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setLabel('Name')
                    .setValue(groupData.name)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setCustomId('name')
                    .setMaxLength(50)
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setLabel('Description')
                    .setValue(groupData.description)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                    .setCustomId('description')
                    .setMaxLength(300)
            )
        ])
        .setCustomId(`editGroup.${group}`);
    interaction.showModal(modal);
}
export async function autocomplete(
    client: GoalBot,
    interaction: AutocompleteInteraction
) {
    const groups = await client.manager.listGroups(interaction.user.id);
    const group = interaction.options.getString('group', true);
    const groupData = groups
        .filter(e => e.name.startsWith(group))
        .map(e => ({ name: e.name, value: e.name }));
    return interaction.respond(groupData);
}
export const data = new SlashCommandSubcommandBuilder()
    .setName('edit')
    .setDescription('Edit a group.')
    .addStringOption(option =>
        option
            .setName('group')
            .setDescription('The name of the group.')
            .setRequired(true)
            .setAutocomplete(true)
    );
