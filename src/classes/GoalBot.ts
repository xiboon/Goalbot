import { Client, Collection } from 'discord.js';
import SQLiteDatabase from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type { Database } from '../types/Database';
import { Loaders } from './Loaders.js';
import { GoalManager } from './GoalManager.js';
import { getCurrencies } from '../utils/getCurrencies.js';

export class GoalBot extends Client {
    db = new Kysely<Database>({
        dialect: new SqliteDialect({
            database: new SQLiteDatabase('database.sqlite')
        })
        // log(event) {
        //     if (event.level === 'query') {
        //         console.log(event.query.sql);
        //         console.log(event.query.parameters);
        //     }
        // }
    });
    commands: Collection<string, any>;
    events: Map<string, any>;
    manager = new GoalManager(this.db);
    currencies: Record<string, number>;
    constructor() {
        super({
            intents: ['GuildMembers'],
            allowedMentions: { parse: [] }
        });
        this.setup();
    }
    async setup() {
        this.currencies = await getCurrencies();
        this.db.schema
            .createTable('users')
            .addColumn('id', 'integer', col => col.primaryKey())
            .addColumn('currency', 'text')
            .ifNotExists()
            .execute();
        this.db.schema
            .createTable('goals')
            .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
            .addColumn('user_id', 'integer')
            .addColumn('goal', 'text')
            .addColumn('amount', 'integer')
            .addColumn('amount_saved', 'integer')
            .addColumn('date_created', 'text')
            .addColumn('description', 'text')
            .ifNotExists()
            .execute();
        await this.login();
        this.commands = await Loaders.loadCommands('../commands');
        await Loaders.loadEvents(this, '../events');

        this.application.commands.set(this.commands.map(cmd => cmd.data));

        setInterval(async () => {
            this.currencies = await getCurrencies();
        }, 1000 * 60 * 60 * 24);
    }
}
