import {
    ActionRowBuilder,
    ModalBuilder,
    StringSelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';
import { GoalBot } from '../classes/GoalBot';

export async function run(client: GoalBot, interaction: StringSelectMenuInteraction) {
    const modal = new ModalBuilder()
        .setTitle('Group Creation')
        .setCustomId(`createGroup.${interaction.values.join('.')}`)
        .setComponents([
            new ActionRowBuilder<TextInputBuilder>().setComponents([
                new TextInputBuilder()
                    .setLabel('Name')
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(50)
                    .setCustomId('name')
            ]),
            new ActionRowBuilder<TextInputBuilder>().setComponents([
                new TextInputBuilder()
                    .setLabel('Description')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(300)
                    .setCustomId('description')
            ])
        ]);
    interaction.showModal(modal);
}
