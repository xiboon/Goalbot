import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';
import { GoalBot } from '../../classes/GoalBot.js';
import { createGoalEmbed } from '../../utils/createGoalEmbed.js';
import { roundToDecimal } from '../../utils/roundToDecimal.js';
import { parseMoneyToUSD } from '../../utils/parseMoney.js';
export async function run(client: GoalBot, interaction: ChatInputCommandInteraction) {
    // validate all arguments
    const name = interaction.options.getString('name', true);
    let amount: string | number = interaction.options.getString('amount', true);
    const description = interaction.options.getString('description', false);
    if (amount === 'invalid')
        return interaction.reply({
            ephemeral: true,
            content: 'Please provide a valid amount needed.'
        });

    if (['USD', 'EUR', 'GBP', 'PLN'].includes(amount.split('-')[1])) {
        const [realAmount, currency] = amount.split('-');
        amount = parseMoneyToUSD(client, parseFloat(realAmount), currency);
    } else {
        const defaultCurrency =
            (await client.manager.getUser(interaction.user.id)).currency ?? 'USD';
        amount = parseInt(amount) / client.currencies[defaultCurrency];
    }

    amount = roundToDecimal(amount, 2);
    const olderGoal = await client.manager.getGoal(interaction.user.id, name);
    const goal = {
        user_id: interaction.user.id,
        goal: name,
        amount,
        amount_saved: 0,
        date_created: Date.now().toString(),
        description: description ?? null
    };
    if (olderGoal)
        return interaction.reply({
            ephemeral: true,
            content: 'You already have a goal with this name.'
        });
    client.manager.createGoal(goal);
    const embed = await createGoalEmbed(client, interaction, goal);
    interaction.reply({ embeds: [embed], content: 'Created your goal!' });
}

export async function autocomplete(_, interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused(true);
    if (!parseInt(focused?.value))
        return interaction.respond([{ name: 'Invalid amount', value: 'invalid' }]);
    const values = ['USD', 'EUR', 'PLN', 'GBP'].map(e => ({
        name: `${focused.value} ${e}`,
        value: `${focused.value}-${e}`
    }));
    interaction.respond(values);
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create a goal.')
    .addStringOption(option =>
        option
            .setName('name')
            .setDescription('Name of the goal.')
            .setRequired(true)
            .setMaxLength(50)
    )
    .addStringOption(option =>
        option
            .setName('amount')
            .setDescription('Amount needed for this goal')
            .setAutocomplete(true)
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('description')
            .setDescription('Description of the goal.')
            .setMaxLength(300)
    );
