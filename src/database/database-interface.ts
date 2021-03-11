import {
    Collection,
    FilterQuery,
    OptionalId,
    UpdateManyOptions,
    UpdateOneOptions,
    UpdateQuery,
    WithId
} from 'mongodb';

export class DatabaseInterface<T> {
    private name: string;

    constructor(private collection: Collection<T>) {
        this.name = collection.namespace;
    }

    getName(): string {
        return this.name;
    }

    async create(data: OptionalId<T>): Promise<WithId<T>> {
        const insertOp = await this.collection.insertOne(data);
        if (insertOp.insertedCount !== 1)
            throw new Error(`(${this.name}) insert failed:\n\t` +
            `insertedCount: ${insertOp.insertedCount}`);
        return insertOp.ops[0];
    }

    async delete(query: FilterQuery<T>): Promise<void> {
        const delOp = await this.collection.deleteOne(query);
        if (delOp.deletedCount !== 1)
            throw new Error(`(${this.name}) delete failed:\n\t` +
            `deleteCount: ${delOp.deletedCount}`);
    }

    async deleteMany(query: FilterQuery<T>, atLeast1 = true): Promise<number> {
        const delOp = await this.collection.deleteMany(query);
        if (atLeast1 && delOp.deletedCount === 0)
            throw new Error(`(${this.name}) deleteMany failed:\n\t` +
            `deleteCount: ${delOp.deletedCount}`);
        return delOp.deletedCount!;
    }

    get(query: FilterQuery<T>): Promise<T | null> {
        return this.collection.findOne(query);
    }

    getMany(query: FilterQuery<T>): Promise<T[]> {
        const cursor = this.collection.find(query);
        return cursor.toArray();
    }

    async updateOne(query: FilterQuery<T>, updates: UpdateQuery<T>, options?: UpdateOneOptions): Promise<void> {
        const upOp = await this.collection.updateOne(query, updates, options);
        if (upOp.matchedCount !== 1)
            throw new Error(`(${this.name}) updateOne failed:\n\t` +
            `matchedCount: ${upOp.matchedCount}\n` +
            'filter: ' + JSON.stringify(query, null, 2));
        if (upOp.modifiedCount !== 1)
            throw new Error(`(${this.name}) updateOne failed:\n\t` +
            `modifiedCount: ${upOp.modifiedCount}`);
    }

    async updateMany(query: FilterQuery<T>, updates: UpdateQuery<T>, options?: UpdateManyOptions): Promise<void> {
        const upOp = await this.collection.updateMany(query, updates, options);
        if (upOp.matchedCount === 0)
            throw new Error(`(${this.name}) updateOne failed:\n\t` +
            `matchedCount: ${upOp.matchedCount}`);
        if (upOp.modifiedCount === 0)
            throw new Error(`(${this.name}) updateOne failed:\n\t` +
            `modifiedCount: ${upOp.modifiedCount}`);
    }
}
