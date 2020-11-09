import { DbUser } from '../../../src/database/database-actions';
import { fillArray } from '../../array';
import { asymmetricalMatch, MockCollection } from '../../mock/database/mock-collection';
import { MockUser, MockUserCollection } from '../../mock';
import { ObjectId } from 'mongodb';
import { fillUsers } from '../../tools';

describe('mock collection', () => {
    describe('matches', () => {
        test('should match', () => {
            expect(asymmetricalMatch(
                { a: 'a', b: 'b' },
                { a: 'a', b: 'b' }
            )).toBe(true);
        });
        test('should not fail if the key has additional fields', () => {
            expect(asymmetricalMatch(
                { a: 'a', b: 'b' },
                { a: 'a', b: 'b', c: 'c' }
            )).toBe(true);
        });
        test('should fail if the key does not fit', () => {
            expect(asymmetricalMatch(
                { a: 'a', b: 'b', c: 'c' },
                { a: 'a', b: 'b' }
            )).toBe(false);
        });
        test('should fail if key values do not match', () => {
            expect(asymmetricalMatch(
                { a: 'a', b: 'b', c: 'c' },
                { a: 'd', b: 'e', c: 'f' }
            )).toBe(false);
        });
        test('should match with nested objects', () => {
            expect(asymmetricalMatch(
                {
                    a: { b: 'b', c: 'c' },
                    d: 'd'
                }, {
                    a: { b: 'b', c: 'c' },
                    d: 'd'
                }
            )).toBe(true);
        });
        test('should work with multiple data types', () => {
            expect(asymmetricalMatch(
                {
                    number: 1000, second: 2000, word: 'hello',
                    obj: {
                        randint: 1337, lets: 'get',
                        crazy: { number: 9001 }
                    }
                }, {
                    number: 1000, second: 2000, word: 'hello',
                    obj: {
                        randint: 1337, lets: 'get',
                        crazy: { number: 9001 }
                    }
                }
            )).toBe(true);
        });
    });
    describe('find', () => {
        test('should find a queried item', () => {
            const user = new MockUser();

            const mock = new MockUserCollection(5);
            mock.data.push(user);

            expect(mock.find({ username: user.username }).internalArray).toContain(user);
        });
        test('should find multiple queried items', () => {
            const password = 'ireland';
            const users = fillUsers(3, null, password);

            const mock = new MockUserCollection(7);
            mock.data.push(...users);

            expect(mock.find({ password }).internalArray).toEqual(users);
        });
    });
    describe('deleteMany', () => {
        test('should delete an entry', async done => {
            const user = new MockUser('quirky-name-quirk-quirk');

            const mock = new MockUserCollection(9);
            mock.data.push(user);

            await mock.deleteMany({ username: user.username });
            expect(mock.data).not.toContain(user);

            done();
        });
        test('should delete many entries', async done => {
            const username = 'high-o';
            const users = fillUsers(4, username);

            const mock = new MockUserCollection(6);
            mock.data.push(...users);

            await mock.deleteMany({ username });
            expect(mock.data).not.toEqual(expect.arrayContaining(users));

            done();
        });
    });
});
