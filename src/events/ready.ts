import { GoalBot } from '../classes/GoalBot';

export async function ready(client: GoalBot) {
    console.log('Ready!');
    // command deploy logic
    const parsedCommands = [];
    client.commands.forEach(async (cmd, key) => {
        if (key.includes('/')) {
            const [name, subcommand] = key.split('/');
            if (subcommand !== 'index') return;
            const subcommands = client.commands.filter(
                (value, key) => key.startsWith(`${name}/`) && key !== `${name}/index`
            );
            const command = cmd.data;
            subcommands.forEach(subcmd => {
                command.addSubcommand(subcmd.data);
            });
            parsedCommands.push(command);
        } else {
            parsedCommands.push(cmd.data);
        }
    });
    // console.log(parsedCommands);
    client.application.commands.set(parsedCommands);
}
