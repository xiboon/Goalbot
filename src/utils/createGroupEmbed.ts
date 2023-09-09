import { EmbedBuilder } from 'discord.js';
import { GoalBot } from '../classes/GoalBot.js';
import { Group } from '../types/Database';
import { roundToDecimal } from './roundToDecimal.js';

export async function createGroupEmbed(client: GoalBot, group: Group, currency?: string) {
    // const user = await client.manager.getUser(group.user_id);
    const validIds = group.ids.split(',');
    const goals = (await client.manager.listGoals(group.user_id)).filter(e =>
        validIds.includes(e.id.toString())
    );
    const totalPercentage = goals.reduce((a, b) => a + b.amount_saved / b.amount, 0);
    const fields = goals.map(e => ({
        name: `${e.goal}`,
        value: `${'▓'.repeat((e.amount_saved / e.amount) * 10).padEnd(10, '░')}\n${
            e.amount_saved
        }/${e.amount * client.currencies[currency || 'USD']} ${currency ?? 'USD'}`,
        inline: true
    }));
    const groupAuthor = await client.users.fetch(group.user_id);
    const embed = new EmbedBuilder()
        .setTitle(group.name)
        .setDescription(group.description)
        .addFields(...fields)
        .setAuthor({
            name: groupAuthor.tag || 'Unknown User',
            iconURL: groupAuthor.displayAvatarURL() || ''
        })
        .setFooter({
            text: `${roundToDecimal((totalPercentage / goals.length) * 100, 2)}% ${'▓'
                .repeat(totalPercentage * 33)
                .padEnd(33, '░')}`
        });
    return embed;
}
