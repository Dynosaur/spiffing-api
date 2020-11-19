import { DbUser } from '../database/data-types';
import { Post, User } from '../server/interface/data-types';
import { Cipher, hash } from '../tools';
import { Collection, ObjectId } from 'mongodb';

export function convertDbUser(dbUser: DbUser): User {
    return {
        _id: dbUser._id.toHexString(),
        created: dbUser._id.generationTime,
        screenname: dbUser.screenname,
        username: dbUser.username
    };
}

export class DatabaseActions {

    cipher = new Cipher(Buffer.from(process.env.KEY, 'hex'));

    constructor(private users: Collection<DbUser>, private posts: Collection<Post>) { }

    securePassword(password: string): { hash: string; salt: string; } {
        const hh = hash(password);
        return {
            hash: this.cipher.encrypt(hh.hash),
            salt: hh.salt
        };
    }

    async authenticate(username: string, password: string): Promise<{ status: 'OK' | 'FAILED' | 'NO_USER'; message: string; data: boolean; }> {
        const user = await this.readUser(username);
        switch (user.status) {
            case 'OK':
                if (this.cipher.decrypt(user.data.password.hash) === hash(password, user.data.password.salt).hash) {
                    return { status: 'OK', message: 'Successful authentication.', data: true };
                } else {
                    return { status: 'FAILED', message: 'Failed authentication.', data: false };
                }
            case 'NO_USER':
                return { status: 'NO_USER', message: `Could not authenticate because the user "${username}" does not exist.`, data: false };
        }
    }

    private async create<T>(collection: Collection<T>, data: any): Promise<void> {
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
                const storedPassword = hash(password);
                storedPassword.hash = this.cipher.encrypt(storedPassword.hash);
                const user: DbUser = {
                    _id: new ObjectId(),
                    password: storedPassword,
                    screenname: username,
                    username
                };
                await this.create<DbUser>(this.users, user);

                return {
                    status: 'OK',
                    message: `Successfully created user "${username}".`
                };
            }
        }
    }

    private async read<T>(collection: Collection<T>, query: any): Promise<T[]> {
        const cursor = collection.find<T>(query);
        const items: T[] = [];
        await cursor.forEach((item: any) => {
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
            return { status: 'NO_MATCH', message: `Could not find user "${oldUsername}", no changes made.`};
        }
        await this.update<Post>(this.posts, { author: oldUsername }, { author: newUsername });
        return { status: 'OK', message: 'Successfully updated username.' };
    }

    async updatePassword(username: string, password: string): Promise<{ status: 'OK' | 'NO_MATCH'; message: string; }> {
        const update = await this.update<DbUser>(this.users, { username }, { password: this.securePassword(password) });
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
