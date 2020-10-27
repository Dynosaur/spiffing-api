import { Collection, FilterQuery, ObjectId, OptionalId, UpdateQuery } from 'mongodb';
import { Post } from '../server/interface/data-types';
import { DbUser } from './data-types';

interface Operation<T> {
    ok: boolean;
    message: string;
    data: T;
}
type UserOperationStatus = 'OK' | 'FAILED' | 'NO_USER';
interface UserOperation<T> {
    status: UserOperationStatus;
    message: string;
    data: T;
}

export class DatabaseActions {

    constructor(private users: Collection<DbUser>, private posts: Collection<Post>) { }

    async authenticate(username: string, password: string): Promise<{ status: 'OK' | 'FAILED' | 'NO_USER'; message: string; data: boolean; }> {
        const user = await this.readUser(username);
        switch (user.status) {
            case 'OK':
                if (user.data.password === password) {
                    return { status: 'OK', message: 'Successful authentication.', data: true };
                } else {
                    return { status: 'FAILED', message: 'Failed authentication.', data: false };
                }
            case 'NO_USER':
                return { status: 'NO_USER', message: `Could not authenticate because the user "${username}" does not exist.`, data: false };
        }
    }

    private async create<T>(collection: Collection<T>, data: any): Promise<void> {
        if (data.id) {
            const id = data.id;
            delete data.id;
            data._id = new ObjectId(id);
            console.log(data);
        }
        await collection.insertOne(data);
    }

    async createPost(title: string, content: string, author: string): Promise<void> {
        this.create(this.posts, { title, content, author, date: Date.now() });
    }

    async createUser(username: string, password: string): Promise<{ status: 'OK' | 'FAILED'; message: string; }> {
        const op = await this.readUser(username);
        switch (op.status) {
            case 'OK':
                return { status: 'FAILED', message: 'Username is taken.' };
            case 'NO_USER': {
                const user: DbUser = { username, password, screenName: username, created: Date.now() };
                await this.create<DbUser>(this.users, user);
                return { status: 'OK', message: `Successfully created user "${username}".` };
            }
        }
    }

    private async read<T>(collection: Collection<T>, query: any): Promise<T[]> {
        if (query.id) {
            const id = query.id;
            delete query.id;
            query._id = new ObjectId(id);
        }
        const cursor = collection.find<T>(query);
        const items: T[] = [];
        await cursor.forEach((item: any) => {
            const id = item._id;
            delete item._id;
            item.id = id;
            items.push(item);
        });
        return items;
    }

    private async readFromPosts(query: any): Promise<Post[]> {
        return this.read<Post>(this.posts, query);
    }

    private async readFromUsers(query: any): Promise<DbUser[]> {
        return this.read<DbUser>(this.users, query);
    }

    async readPosts(query: any): Promise<Post[]> {
        return await this.readFromPosts(query);
    }

    async readUser(username: string): Promise<{ status: 'OK'; data: DbUser; } | { status: 'NO_USER'; }> {
        const users = await this.readFromUsers({ username });
        if (users.length) {
            const user = users[0];
            return { status: 'OK', data: user };
        } else {
            return { status: 'NO_USER' };
        }
    }

    private async update<T>(collection: Collection<T>, query: { [key in keyof T]?: T[key] }, updates: { [key in keyof T]?: T[key] }): Promise<'OK' | 'NO_MATCH'> {
        const queriedItems = await this.read(collection, query);
        if (!queriedItems.length) {
            return 'NO_MATCH';
        }
        await collection.updateMany(query, { $set: updates });
        return 'OK';
    }

    async updateUsername(oldUsername: string, newUsername: string): Promise<{ status: 'OK' | 'NO_MATCH'; message: string; }> {
        const userUpdate = await this.update<DbUser>(this.users, { username: oldUsername }, { username: newUsername });
        if (userUpdate === 'NO_MATCH') {
            return { status: 'NO_MATCH', message: `Could not find user "${oldUsername}", no changes made.`}
        }
        await this.update<Post>(this.posts, { author: oldUsername }, { author: newUsername });
        return { status: 'OK', message: 'Successfully updated username.' };
    }

    async updatePassword(username: string, password: string): Promise<{ status: 'OK' | 'NO_MATCH'; message: string; }> {
        const update = await this.update<DbUser>(this.users, { username }, { password });
        if (update === 'NO_MATCH') {
            return { status: 'NO_MATCH', message: `Could not find user "${username}", no changes made.` };
        }
        return { status: 'OK', message: 'Successfully updated password.' };
    }

    private async delete<T>(collection: Collection<T>, query: { [key in keyof T]?: T[key] }): Promise<boolean> {
        await collection.deleteMany(query);
        const items = await this.read(collection, query);
        return items.length === 0;
    }

    async deleteUser(username: string): Promise<boolean> {
        return this.delete(this.users, { username });
    }

    async deletePosts(query: { [key in keyof Post]?: Post[key] }): Promise<boolean> {
        return this.delete(this.posts, query);
    }

}