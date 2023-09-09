import { Generated } from 'kysely';

export interface UserTable {
    id: string;
    currency: string;
}
export interface Goal {
    id?: number;
    user_id: string;
    goal: string;
    amount: number;
    amount_saved: number;
    date_created: string;
    description: string | null;
}
export interface Group {
    ids: string;
    user_id: string;
    name: string;
    description: string;
}
export interface GoalTable {
    id: Generated<number>;
    user_id: string;
    goal: string;
    amount: number;
    amount_saved: number;
    date_created: string;
    description: string;
}
export interface Database {
    users: UserTable;
    goals: GoalTable;
    groups: Group;
}
