import { Db } from 'mongodb';

export class UserActions {

    constructor(private db: Db) { }

    public async create(name: string, password: string): Promise<void> {
        const collection = this.db.collection('user');
        await collection.insertOne({ name, password });
    }

    public async delete(name: string): Promise<void> {
        const collection = this.db.collection('user');
        await collection.deleteOne({ name });
    }

    public async get(query: any): Promise<any> {
        const cursor = this.db.collection('user').find(query);
        const items = [];
        while (await cursor.hasNext()) {
            items.push(await cursor.next());
        }
        if (items.length === 0) {
            return undefined;
        } else if (items.length === 1) {
            return items[0];
        } else {
            return items;
        }
    }
}