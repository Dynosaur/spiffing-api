import { ObjectId } from 'mongodb';
import { DatabaseInterface } from 'database/dbi/database-interface';
import { MockCollection } from 'tests/mock';
import { randomBytes } from 'crypto';

class MockData {
    _id = new ObjectId();
    name = randomBytes(16).toString('hex');
}

describe('DatabaseInterface class', () => {
    let dbi: DatabaseInterface<MockData>;
    let collection: MockCollection<MockData>;
    beforeEach(() => {
        collection = new MockCollection();
        dbi = new DatabaseInterface(collection as any);
    });
    it('should be able to create items', async done => {
        const mock = new MockData();
        await dbi.create(mock);
        expect(collection.insertOneSpy).toBeCalledWith(mock);
        expect(collection.data[0]).toStrictEqual(mock);
        done();
    });
    it('should be able to read items', async done => {
        const mock = new MockData();
        collection.data.push(mock);
        expect(await dbi.read({ _id: mock._id })).toStrictEqual([mock]);
        done();
    });
    it('should be able to update items', async done => {
        const mock = new MockData();
        collection.data.push(mock);
        expect(await dbi.update({ _id: mock._id }, { name: 'Eren' })).toStrictEqual({
            matched: 1,
            modified: 1
        });
        expect(mock.name).toBe('Eren');
        done();
    });
    it('should be able to delete items', async done => {
        const mock = new MockData();
        collection.data.push(mock);
        await dbi.delete({ _id: mock._id });
        expect(collection.deleteManySpy).toBeCalledWith({ _id: mock._id });
        expect(collection.data.length).toBe(0);
        done();
    });
});
