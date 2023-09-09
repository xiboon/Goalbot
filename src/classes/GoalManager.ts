import { Kysely } from 'kysely';
import type { Database, Goal, Group, UserTable } from '../types/Database';
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
    async deleteGoal(data: Goal) {
        await this.db
            .deleteFrom('goals')
            .where('id', '=', data.id)
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
    async getGoalById(userId: string, id: number) {
        return this.db
            .selectFrom('goals')
            .selectAll()
            .where('id', '=', id)
            .where('user_id', '=', userId)
            .executeTakeFirst();
    }
    async editGoal(oldName: string, data: Goal) {
        await this.db
            .updateTable('goals')
            .set(data)
            .where('goal', '=', oldName)
            .where('user_id', '=', data.user_id)
            .execute();
    }
    async createUser(id: string) {
        await this.db.insertInto('users').values({ id, currency: 'USD' }).execute();
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
                .executeTakeFirst()) || ({ id, currency: 'USD' } as unknown as UserTable)
        );
    }
    async listGoals(userId: string): Promise<Goal[]> {
        return this.db
            .selectFrom('goals')
            .selectAll()
            .where('user_id', '=', userId)
            .execute();
    }
    async createGroup(data: Group) {
        await this.db.insertInto('groups').values(data).execute();
    }
    async getGroup(userId: string, name: string) {
        return this.db
            .selectFrom('groups')
            .selectAll()
            .where('name', '=', name)
            .where('user_id', '=', userId)
            .executeTakeFirst();
    }
    async listGroups(userId: string) {
        return this.db
            .selectFrom('groups')
            .selectAll()
            .where('user_id', '=', userId)
            .execute();
    }
    async deleteGroup(userId: string, name: string) {
        await this.db
            .deleteFrom('groups')
            .where('name', '=', name)
            .where('user_id', '=', userId)
            .execute();
    }
    async editGroup(oldName: string, data: Group) {
        await this.db
            .updateTable('groups')
            .set(data)
            .where('name', '=', oldName)
            .where('user_id', '=', data.user_id)
            .execute();
    }
}
