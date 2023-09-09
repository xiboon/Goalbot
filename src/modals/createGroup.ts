import { ModalSubmitInteraction } from 'discord.js';
import { GoalBot } from '../classes/GoalBot';
import { createGroupEmbed } from '../utils/createGroupEmbed.js';

export async function run(client: GoalBot, interaction: ModalSubmitInteraction) {
    const goals = interaction.customId.split('.').slice(1).join(',');
    const name = interaction.fields.getField('name').value;
    const description = interaction.fields.getField('description').value;

    await client.manager.createGroup({
        description,
        name,
        ids: goals,
        user_id: interaction.user.id
    });
    const embed = await createGroupEmbed(client, {
        description,
        name,
        ids: goals,
        user_id: interaction.user.id
    });
    await interaction.reply({
        content: 'Group created!',
        embeds: [embed],
        ephemeral: true
    });
}
