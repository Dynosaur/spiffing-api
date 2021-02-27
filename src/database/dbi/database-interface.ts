import { Collection, FilterQuery, ObjectId, OptionalId, UpdateQuery, WithId } from 'mongodb';

export class DatabaseInterface<T> {
    private name: string;

    constructor(private collection: Collection<T>) {
        this.name = collection.namespace;
    }

    async create(data: OptionalId<T>): Promise<WithId<T>> {
        const insertOp = await this.collection.insertOne(data);
        if (insertOp.insertedCount !== 1)
            throw new Error(`${this.collection.collectionName}: insert failed:
             insertedCount: ${insertOp.insertedCount}`);
        return insertOp.ops[0];
    }

    async delete(query: FilterQuery<T>): Promise<void> {
        const delOp = await this.collection.deleteOne(query);
        if (delOp.deletedCount !== 1)
            throw new Error(`${this.collection.collectionName}: delete failed:
             deleteCount: ${delOp.deletedCount}`);
    }

    get(query: FilterQuery<T>): Promise<T | null> {
        return this.collection.findOne(query);
    }

    getMany(query: FilterQuery<T>): Promise<T[]> {
        const cursor = this.collection.find(query);
        return cursor.toArray();
    }

    async updateOne(query: FilterQuery<T>, updates: UpdateQuery<T>): Promise<void> {
        const upOp = await this.collection.updateOne(query, updates);
        if (upOp.matchedCount !== 1)
            throw new Error(`(${this.name}) updateOne failed: matchedCount: ${upOp.matchedCount}`);
        if (upOp.modifiedCount !== 1)
            throw new Error(`(${this.name}) updateOne failed: modifiedCount: ${upOp.modifiedCount}`);
    }

    async updateMany(query: FilterQuery<T>, updates: UpdateQuery<T>): Promise<void> {
        const upOp = await this.collection.updateMany(query, updates);
        if (upOp.matchedCount === 0)
            throw new Error(`(${this.name}) updateOne failed: matchedCount: ${upOp.matchedCount}`);
        if (upOp.modifiedCount === 0)
            throw new Error(`(${this.name}) updateOne failed: modifiedCount: ${upOp.modifiedCount}`);
    }

}
