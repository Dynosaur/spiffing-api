import { MockCursor } from './mock-cursor';

export function asymmetricalMatch(hole: object, key: object): boolean {
    const requiredKeys = Object.keys(hole);
    for (const reqKey of requiredKeys) {
        if (key[reqKey]) {
            if (typeof hole[reqKey] === 'object') {
                if (typeof key[reqKey] === 'object') {
                    if (!asymmetricalMatch(hole[reqKey], key[reqKey])) {
                        return false;
                    }
                    break;
                } else {
                    return false;
                }
            }
            if (key[reqKey] !== hole[reqKey]) {
                return false;
            }
        } else {
            return false;
        }
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

    find(query: any): MockCursor {
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

    async deleteMany(query: any): Promise<void> {
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
