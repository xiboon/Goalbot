import { GoalBot } from '../classes/GoalBot';

export function parseMoneyToUSD(client: GoalBot, amount: number, currency: string) {
    if (currency === 'USD') return amount;
    return amount / client.currencies[currency];
}
