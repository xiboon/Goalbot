import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalSubmitInteraction,
    StringSelectMenuBuilder
} from 'discord.js';
import { GoalBot } from '../classes/GoalBot';

export async function run(client: GoalBot, interaction: ModalSubmitInteraction) {
    const name = interaction.fields.getField('name').value;
    const description = interaction.fields.getField('description').value;
    const group = await client.manager.getGroup(interaction.user.id, name);
    const goals = await client.manager.listGoals(interaction.user.id);
    await client.manager.editGroup(group.name, {
        description,
        name,
        ids: group.ids,
        user_id: interaction.user.id
    });
    const selectMenu = new StringSelectMenuBuilder()
        .setOptions(
            goals.map(e => ({ label: e.goal, value: e.id.toString(), default: true }))
        )
        .setMaxValues(goals.length)
        .setCustomId(`editGroup.${name}`);
    const button = new ButtonBuilder()
        .setLabel('Keep goals')
        .setCustomId('keepGoals')
        .setStyle(ButtonStyle.Primary);
    interaction.reply({
        content: `Select the goals you want in the group ${name}!`,
        components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu),
            new ActionRowBuilder<ButtonBuilder>().addComponents(button)
        ]
    });
}
