import { MockCursor } from './mock-cursor';

export function requireObjectKeys(model: any, subject: any): boolean {
    if (model === undefined || model === null) throw new Error(`Model is ${model}.`);
    if (subject === undefined || subject === null) throw new Error(`Subject is ${subject}.`);
    if (typeof model === 'object') {
        if (typeof subject === 'object') {
            const modelKeys = Object.keys(model);
            for (const required of modelKeys)
                if (required in subject) {
                    if (typeof model[required] === 'object') {
                        if (typeof subject[required] === 'object') {
                            if (!requireObjectKeys(model[required], subject[required])) return false;
                        } else return false;
                    } else if (subject[required] !== model[required]) return false;
                } else return false;
        } else return false;
    } else if (model !== subject) return false;
    return true;
}

export class MockCollection<T extends object> {

    data: T[] = [];

    forceFind: T[];
    findSpy = jest.fn();
    insertOneSpy = jest.fn();
    forceDeleteMany = true;
    deleteManySpy = jest.fn();
    updateManySpy = jest.fn();

    find(query: Partial<T>): MockCursor<T> {
        this.findSpy(query);

        if (this.forceFind) {
            return new MockCursor(this.forceFind);
        }
        if (!query || Object.keys(query).length === 0) {
            return new MockCursor(this.data);
        }

        const matched: T[] = [];
        this.data.forEach(object => {
            if (requireObjectKeys(query, object)) {
                matched.push(object);
            }
        });

        return new MockCursor(matched);
    }

    async insertOne(object: T): Promise<void> {
        this.insertOneSpy(object);
        this.data.push(object);
    }

    async deleteMany(query: Partial<T>): Promise<void> {
        this.deleteManySpy(query);

        if (!this.forceDeleteMany) {
            return;
        }

        for (let i = this.data.length - 1; i >= 0; i--) {
            if (requireObjectKeys(query, this.data[i])) {
                this.data.splice(i, 1);
            }
        }
    }

    async updateMany(query: object, update: { $set: any }): Promise<{ matchedCount: number, modifiedCount: number; }> {
        this.updateManySpy(query, update);

        let matched = 0;
        let modified = 0;
        for (const element of this.data) {
            if (requireObjectKeys(query, element)) {
                matched++;
                let hasBeenModified = false;
                const updatedKeys = Object.keys(update.$set);
                for (const key of updatedKeys) {
                    if (!requireObjectKeys(update.$set[key], element[key])) {
                        if (!hasBeenModified) {
                            hasBeenModified = true;
                            modified++;
                        }
                        element[key] = update.$set[key];
                    }
                }
            }
        }

        return {
            matchedCount: matched,
            modifiedCount: modified
        };
    }
}
