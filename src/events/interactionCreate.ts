import { Interaction } from 'discord.js';
import type { GoalBot } from '../classes/GoalBot';

export async function interactionCreate(
    client: GoalBot,
    interaction: Interaction
) {
    if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.autocomplete(client, interaction);
        } catch (error) {
            console.error(error);
        }
        return;
    }
    // h
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.run(client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
}
