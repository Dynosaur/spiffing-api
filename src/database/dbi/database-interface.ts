import { Collection, ObjectId } from 'mongodb';

export interface Identifiable {
    _id: ObjectId;
}

export class DatabaseInterface<T extends Identifiable> {

    constructor(private collection: Collection<T>) { }

    async create(data: T): Promise<void> {
        await this.collection.insertOne(data as any);
    }

    async delete(query: Partial<T>): Promise<void> {
        await this.collection.deleteMany(query);
    }

    async read(query: Partial<T>): Promise<T[]> {
        const cursor = this.collection.find<T>(query);
        const items: T[] = [];
        await cursor.forEach(item => items.push(item));
        return items;
    }

    async update(query: Partial<T>, updates: Partial<T>): Promise<{ matched: number; modified: number; }> {
        const updateRequest = await this.collection.updateMany(query, { $set: updates });
        return {
            matched: updateRequest.matchedCount,
            modified: updateRequest.modifiedCount
        };
    }

}
