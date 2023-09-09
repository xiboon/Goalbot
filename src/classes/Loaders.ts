import { readdirSync } from 'fs';
import type { GoalBot } from './GoalBot';
import { Collection } from 'discord.js';
export class Loaders {
    static async loadCommands(path: string) {
        const dir = readdirSync(new URL(path, import.meta.url));
        const commands = new Collection<string, any>();
        // subcommand handling
        for await (const file of dir) {
            if (file.split('.')[1] !== 'js' && !file.split('.')[1]) {
                const subCommands = this.loadCommands(`${path}/${file}`);
                (await subCommands).forEach((v, k) =>
                    commands.set(`${file.split('.')[0]}/${k}`, v)
                );
                continue;
            }
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
            client.on(name, (...events) => event[name](client, ...events));
        }
    }
    static async loadComponents(path: string) {
        const dir = readdirSync(new URL(path, import.meta.url));
        const components = new Collection<string, any>();
        for await (const file of dir) {
            if (file.split('.')[1] !== 'js' && !file.split('.')[2]) continue;
            const component = await import(`${path}/${file}`);
            components.set(file.split('.')[0], component);
        }
        return components;
    }
    static async loadModals(path: string) {
        const dir = readdirSync(new URL(path, import.meta.url));
        const modals = new Collection<string, any>();
        for await (const file of dir) {
            if (file.split('.')[1] !== 'js' && !file.split('.')[2]) continue;
            const modal = await import(`${path}/${file}`);
            modals.set(file.split('.')[0], modal);
        }
        return modals;
    }
}
