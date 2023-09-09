import { Interaction, InteractionType } from 'discord.js';
import type { GoalBot } from '../classes/GoalBot';

export async function interactionCreate(client: GoalBot, interaction: Interaction) {
    switch (interaction?.type) {
        case InteractionType.ApplicationCommand:
            if (!interaction.isChatInputCommand()) return;
            const subcommand = interaction.options.getSubcommand(false);
            let command;
            if (subcommand) {
                command = client.commands.get(`${interaction.commandName}/${subcommand}`);
            } else {
                command = client.commands.get(interaction.commandName);
            }
            try {
                command.run(client, interaction);
            } catch (e) {
                console.error(e);
                interaction.reply({ content: 'An error occured.', ephemeral: true });
            }
            break;
        case InteractionType.MessageComponent:
            const [id] = interaction.customId.split('.');
            const component = client.components.get(id);
            try {
                component.run(client, interaction);
            } catch (e) {
                console.error(e);
                interaction.reply({ content: 'An error occured.', ephemeral: true });
            }
            break;
        case InteractionType.ModalSubmit:
            const [modalId] = interaction.customId.split('.');
            const modal = client.modals.get(modalId);
            try {
                modal.run(client, interaction);
            } catch (e) {
                console.error(e);
                interaction.reply({ content: 'An error occured.', ephemeral: true });
            }
            break;
        case InteractionType.ApplicationCommandAutocomplete:
            let autocomplete;
            if (interaction.options.getSubcommand(false)) {
                autocomplete = client.commands.get(
                    `${interaction.commandName}/${interaction.options.getSubcommand(
                        false
                    )}`
                );
            } else {
                autocomplete = client.commands.get(interaction.commandName);
            }
            try {
                autocomplete.autocomplete(client, interaction);
            } catch (e) {
                console.error(e);
            }
            break;
    }
}
