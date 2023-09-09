import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    StringSelectMenuBuilder
} from 'discord.js';
import { GoalBot } from '../../classes/GoalBot.js';
import { createGoalEmbed } from '../../utils/createGoalEmbed.js';

export async function run(client: GoalBot, interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('goal', true);
    const goal = await client.manager.getGoal(interaction.user.id, name);
    if (!goal)
        return interaction.reply({
            content: `You don't have a goal named ${name}`,
            ephemeral: true
        });
    const embed = await createGoalEmbed(client, interaction, goal);
    const currencies = ['USD', 'EUR', 'PLN', 'GBP'];
    const currencySelect = new StringSelectMenuBuilder()
        .setOptions(currencies.map(e => ({ label: e, value: e })))
        .setPlaceholder('Select a currency to view.')
        .setCustomId(`currencySelect.${goal.id}.${goal.user_id}`);
    interaction.reply({
        embeds: [embed],
        components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().setComponents([
                currencySelect
            ])
        ]
    });
}
export async function autocomplete(client, interaction) {
    const focused = interaction.options.getFocused(true);
    const goals = await client.manager.listGoals(interaction.user.id);
    const values = goals
        .filter(e => e.goal.startsWith(focused.value))
        .map(e => ({
            name: e.goal,
            value: e.goal
        }));
    interaction.respond(values);
}
export const data = new SlashCommandSubcommandBuilder()
    .setName('view')
    .setDescription('View a goal.')
    .addStringOption(option =>
        option
            .setName('goal')
            .setDescription('The goal to view.')
            .setAutocomplete(true)
            .setRequired(true)
    );
