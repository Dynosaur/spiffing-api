import { MockCursor } from './mock-cursor';

export function asymmetricalMatch(model: object, subject: object): boolean {
    if (typeof model !== 'object') throw new Error('Model must be an object. Type provided: ' + typeof model);
    if (subject === undefined || subject === null) return false;

    const modelKeys = Object.keys(model);
    for (const required of modelKeys) {
        if (required in subject) {
            if (typeof model[required] === 'object') {
                if (typeof subject[required] === 'object') {
                    if (!asymmetricalMatch(model[required], subject[required])) return false;
                } else return false;
            } else if (subject[required] !== model[required]) return false;
        } else return false;
    }
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
            if (asymmetricalMatch(query, object)) {
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
            if (asymmetricalMatch(query, this.data[i])) {
                this.data.splice(i, 1);
            }
        }
    }

    async updateMany(query: object, update: { $set: any }): Promise<void> {
        this.updateManySpy(query, update);

        this.data.forEach(object => {
            if (asymmetricalMatch(query, object)) {
                const updatedKeys = Object.keys(update.$set);
                for (const key of updatedKeys) {
                    object[key] = update.$set[key];
                }
            }
        });
    }
}
