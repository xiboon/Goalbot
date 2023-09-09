import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';
import { GoalBot } from '../../classes/GoalBot';
import { parseMoneyToUSD } from '../../utils/parseMoney.js';

export async function run(client: GoalBot, interaction: ChatInputCommandInteraction) {
    const goal = await interaction.options.getString('oldName', true);
    const goalData = await client.manager.getGoal(interaction.user.id, goal);
    if (!goalData) {
        return interaction.reply({
            content: `You don't have a goal named ${goal}!`,
            ephemeral: true
        });
    }
    const name = interaction.options.getString('name');
    let amount: number | string = interaction.options.getString('amount');
    const description = interaction.options.getString('description');
    if (['USD', 'EUR', 'GBP', 'PLN'].includes(amount.split('-')[1])) {
        const [realAmount, currency] = amount.split('-');
        amount = parseMoneyToUSD(client, parseFloat(realAmount), currency);
    } else {
        const defaultCurrency =
            (await client.manager.getUser(interaction.user.id)).currency ?? 'USD';
        amount = parseInt(amount) / client.currencies[defaultCurrency];
    }
    client.manager.editGoal(goal, {
        ...goalData,
        goal: name ?? goalData.goal,
        amount: amount ?? goalData.amount,
        description: description ?? goalData.description
    });
}
export async function autocomplete(
    client: GoalBot,
    interaction: AutocompleteInteraction
) {
    const focused = interaction.options.getFocused(true);
    if (focused.name === 'oldName') {
        const goals = await client.manager.listGoals(interaction.user.id);
        const values = goals
            .filter(e => e.goal.startsWith(focused.value))
            .map(e => ({
                name: e.goal,
                value: e.goal
            }));
        interaction.respond(values);
    } else {
        if (!parseInt(focused?.value))
            return interaction.respond([{ name: 'Invalid amount', value: 'invalid' }]);
        const values = ['USD', 'EUR', 'PLN', 'GBP'].map(e => ({
            name: `${focused.value} ${e}`,
            value: `${focused.value}-${e}`
        }));

        interaction.respond(values);
    }
}
export const data = new SlashCommandSubcommandBuilder()
    .setName('edit')
    .setDescription('Edit a goal.')
    .addStringOption(option =>
        option
            .setName('old-name')
            .setDescription('Old name of the goal.')
            .setRequired(true)
            .setAutocomplete(true)
            .setMaxLength(50)
    )
    .addStringOption(option =>
        option
            .setName('name')
            .setDescription('New name of the goal.')
            .setRequired(false)
            .setMaxLength(50)
    )
    .addStringOption(option =>
        option
            .setName('amount')
            .setDescription('Amount needed for this goal')
            .setAutocomplete(true)
            .setRequired(false)
    )
    .addStringOption(option =>
        option
            .setName('description')
            .setDescription('Description of the goal.')
            .setMaxLength(300)
    );
