import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from 'discord.js';
import type { GoalBot } from '../classes/GoalBot.js';
import * as create from './goalCommands/create.js';

export async function run(
    client: GoalBot,
    interaction: ChatInputCommandInteraction
) {
    switch (interaction.options.getSubcommand()) {
        case 'create':
            return create.run(client, interaction);
    }
}

export async function autocomplete(
    client: GoalBot,
    interaction: AutocompleteInteraction
) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
        case 'create':
            return create.autocomplete(client, interaction);
    }
}
export const data = new SlashCommandBuilder()
    .setName('goal')
    .setDescription('Manage your goals.')
    .addSubcommand(create.data);
