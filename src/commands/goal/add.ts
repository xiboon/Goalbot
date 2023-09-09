import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';
import { GoalBot } from '../../classes/GoalBot.js';
import { parseMoneyToUSD } from '../../utils/parseMoney.js';
import { createGoalEmbed } from '../../utils/createGoalEmbed.js';

export async function run(client: GoalBot, interaction: ChatInputCommandInteraction) {
    const goal = interaction.options.getString('goal', true);
    const goalData = await client.manager.getGoal(interaction.user.id, goal);
    const amount = interaction.options.getString('amount', true);
    const splitAmount = amount.split('-');
    if (!goalData)
        return interaction.reply({
            ephemeral: true,
            content: 'No goal found under this name.'
        });
    let parsedAmount: number;
    if (splitAmount.length < 2) {
        const { currency } = await client.manager.getUser(interaction.user.id);
        parsedAmount = parseMoneyToUSD(client, parseInt(splitAmount[0]), currency);
    } else {
        const [, currency] = splitAmount;
        parsedAmount = parseMoneyToUSD(client, parseInt(splitAmount[0]), currency);
    }
    goalData.amount_saved += parsedAmount;
    goalData.user_id = interaction.user.id;
    client.manager.updateGoal(goalData);
    const embed = await createGoalEmbed(client, interaction, goalData);
    interaction.reply({
        content: "Updated your goal's saved amount",
        embeds: [embed]
    });
}
export async function autocomplete(
    client: GoalBot,
    interaction: AutocompleteInteraction
) {
    const focused = interaction.options.getFocused(true);
    switch (focused.name) {
        case 'goal':
            const goals = await client.manager.listGoals(interaction.user.id);
            const values = goals
                .filter(e => e.goal.startsWith(focused.value))
                .map(e => ({
                    name: e.goal,
                    value: e.goal
                }));
            interaction.respond(values);
            break;
        case 'amount':
            const amount = parseInt(focused.value);
            if (isNaN(amount))
                return interaction.respond([
                    { name: 'Invalid amount', value: 'invalid' }
                ]);
            const currencies = ['USD', 'EUR', 'PLN', 'GBP'].map(e => ({
                name: `${amount} ${e}`,
                value: `${amount}-${e}`
            }));
            interaction.respond(currencies);
    }
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('add')
    .setDescription('Add money to a goal.')
    .addStringOption(option =>
        option
            .setName('goal')
            .setDescription('The goal to add money to.')
            .setAutocomplete(true)
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('amount')
            .setDescription('Amount to add.')
            .setAutocomplete(true)
            .setRequired(true)
    );
