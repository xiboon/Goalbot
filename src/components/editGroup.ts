import { StringSelectMenuInteraction } from 'discord.js';
import { GoalBot } from '../classes/GoalBot';

export async function run(client: GoalBot, interaction: StringSelectMenuInteraction) {
    const [, group] = interaction.customId.split('.');
    const groupData = await client.manager.getGroup(interaction.user.id, group);
    const { values } = interaction;
    client.manager.editGroup(group, {
        ...groupData,
        ids: values.join(',')
    });
    interaction.reply({
        content: `Edited group ${group}!`,
        ephemeral: true
    });
}
