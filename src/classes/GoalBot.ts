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
    events: Map<string, any>;
    manager = new GoalManager(this.db);
    currencies: Record<string, number>;
    commands: Collection<string, any>;
    components: Collection<string, any>;
    modals: Collection<string, any>;
    constructor() {
        super({
            intents: ['GuildMembers'],
            allowedMentions: { parse: [] }
        });
        this.setup();
    }
    async setup() {
        this.currencies = await getCurrencies();
        this.components = await Loaders.loadComponents('../components');
        this.commands = await Loaders.loadCommands('../commands');
        this.modals = await Loaders.loadModals('../modals');
        await Loaders.loadEvents(this, '../events');
        this.db.schema
            .createTable('users')
            .addColumn('id', 'integer', col => col.primaryKey())
            .addColumn('currency', 'text')
            .ifNotExists()
            .execute();
        this.db.schema
            .createTable('goals')
            .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
            .addColumn('user_id', 'text')
            .addColumn('goal', 'text')
            .addColumn('amount', 'integer')
            .addColumn('amount_saved', 'integer')
            .addColumn('date_created', 'text')
            .addColumn('description', 'text')
            .ifNotExists()
            .execute();
        this.db.schema
            .createTable('groups')
            .addColumn('ids', 'text')
            .addColumn('user_id', 'text')
            .addColumn('name', 'text')
            .addColumn('description', 'text')
            .ifNotExists()
            .execute();

        await this.login();

        setInterval(async () => {
            this.currencies = await getCurrencies();
        }, 1000 * 60 * 60 * 24);
    }
}
