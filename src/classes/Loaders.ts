import { readdirSync } from 'fs';
import type { GoalBot } from './GoalBot';
import { Collection } from 'discord.js';
export class Loaders {
    static async loadCommands(path: string) {
        const dir = readdirSync(new URL(path, import.meta.url));
        const commands = new Collection<string, any>();
        for await (const file of dir) {
            if (file.split('.')[1] !== 'js' && !file.split('.')[2]) continue;
            const cmd = await import(`${path}/${file}`);
            commands.set(file.split('.')[0], cmd);
        }
        return commands;
    }
    static async loadEvents(client: GoalBot, path: string) {
        const dir = readdirSync(new URL(path, import.meta.url));
        for await (const file of dir) {
            if (file.split('.')[1] !== 'js' && !file.split('.')[2]) continue;
            const event = await import(`${path}/${file}`);
            const [name] = file.split('.');
            client.on(name, event[name].bind(null, client));
        }
    }
}
