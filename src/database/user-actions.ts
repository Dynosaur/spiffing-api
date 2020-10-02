import { Db, Collection } from 'mongodb';
import { DbUser } from './data-types';
import { User } from '../server';

export class UserActions {

    constructor(private users: Collection<DbUser>) { }

    public async create(username: string, password: string): Promise<void> {
        const result = await this.users.insertOne({
            username,
            password,
            screenName:
            username, created: Date.now()
        });
    }

    public async delete(query: object): Promise<void> {
        const result = await this.users.deleteMany({ query });
    }

    public async get(query: any): Promise<DbUser[]> {
        const cursor = this.users.find(query);
        const items: DbUser[] = [];
        while (await cursor.hasNext()) {
            items.push(await cursor.next());
        }
        return items;
    }

    public async getOne(username: string): Promise<DbUser> {
        return await this.users.findOne({ username });
    }

    public async getUserNoPassword(username: string): Promise<User> {
        const user = await this.getOne(username);
        delete user.password;
        return user;
    }

    public async isUsernameUnique(username: string): Promise<boolean> {
        const users = await this.users.findOne({ username });
        return !users;
    }
}