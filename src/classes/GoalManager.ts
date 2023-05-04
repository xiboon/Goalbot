import { Kysely } from 'kysely';
import type { Database, Goal, GoalTable, UserTable } from '../types/Database';
export class GoalManager {
    db: Kysely<Database>;
    constructor(db: Kysely<Database>) {
        this.db = db;
    }
    async createGoal(data: Goal) {
        await this.db.insertInto('goals').values(data).execute();
    }
    async updateGoal(data: Goal) {
        await this.db
            .updateTable('goals')
            .set(data)
            .where('goal', '=', data.goal)
            .where('user_id', '=', data.user_id)
            .execute();
    }
    async getGoal(userId: string, name: string) {
        return this.db
            .selectFrom('goals')
            .selectAll()
            .where('goal', '=', name)
            .where('user_id', '=', userId)
            .executeTakeFirst();
    }
    async createUser(id: string) {
        await this.db
            .insertInto('users')
            .values({ id, currency: 'USD' })
            .execute();
    }
    async updateUser(id: string, currency: string) {
        await this.db
            .updateTable('users')
            .set({ currency })
            .where('id', '=', id)
            .execute();
    }
    async getUser(id: string): Promise<UserTable> {
        return (
            (await this.db
                .selectFrom('users')
                .selectAll()
                .where('id', '=', id)
                .executeTakeFirst()) ||
            ({ id, currency: 'USD' } as unknown as UserTable)
        );
    }
    async listGoals(userId: string): Promise<Goal[]> {
        return this.db
            .selectFrom('goals')
            .selectAll()
            .where('user_id', '=', userId)
            .execute();
    }
}
