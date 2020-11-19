import { DbPost } from '../../src/database';
import { fillArray } from '../tools';
import { asymmetricalMatch } from '../mock/database/mock-collection';
import { MockCollection, MockPost } from '../mock';


describe('mock collection', () => {
    describe('asymmetricalMatch', () => {
        it('should match identical objects', () => {
            expect(asymmetricalMatch(
                { a: 'a' },
                { a: 'a' }
            )).toBe(true);
            expect(asymmetricalMatch(
                { a: 'a', b: 'b' },
                { a: 'a', b: 'b' }
            )).toBe(true);
            expect(asymmetricalMatch(
                { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g', h: 'h' },
                { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g', h: 'h' }
            )).toBe(true);
        });
        it('should match key with additional fields', () => {
            expect(asymmetricalMatch(
                { a: 'a', },
                { a: 'a', b: 'b' }
            )).toBe(true);
            expect(asymmetricalMatch(
                { a: 'a', b: 'b' },
                { a: 'a', b: 'b', c: 'c' }
            )).toBe(true);
            expect(asymmetricalMatch(
                { a: 'a', b: 'b', c: 'c', d: 'd' },
                { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g', h: 'h' }
            )).toBe(true);
        });
        it('should not match if the key does not fit', () => {
            expect(asymmetricalMatch(
                { a: 'a' },
                { }
            )).toBe(false);
            expect(asymmetricalMatch(
                { a: 'a' },
                { b: 'b' }
            )).toBe(false);
            expect(asymmetricalMatch(
                { a: 'a', b: 'b', c: 'c' },
                { a: 'a', b: 'b' }
            )).toBe(false);
        });
        it('should not match if key values do not match', () => {
            expect(asymmetricalMatch(
                { a: 'a', b: 'b', c: 'c' },
                { a: 'd', b: 'e', c: 'f' }
            )).toBe(false);
        });
        it('should match with nested objects', () => {
            expect(asymmetricalMatch(
                {
                    a: { b: 'b' }
                }, {
                    a: { b: 'b' },
                }
            )).toBe(true);
            expect(asymmetricalMatch(
                {
                    a: { b: 'b' }
                }, {
                    a: { },
                }
            )).toBe(false);
            expect(asymmetricalMatch(
                {
                    a: { b: 'b' }
                }, {
                    a: { c: 'c' },
                }
            )).toBe(false);
            expect(asymmetricalMatch(
                {
                    a: { b: 'b' }
                }, {
                    a: { b: 'c' },
                }
            )).toBe(false);
            expect(asymmetricalMatch(
                {
                    a: { b: 'b', c: 'c' },
                    d: 'd'
                }, {
                    a: { b: 'b', c: 'c' },
                    d: 'd'
                }
            )).toBe(true);
            expect(asymmetricalMatch(
                {
                    a: { b: 'b', c: 'c', d: 'd' },
                    d: 'd'
                }, {
                    a: { b: 'b', c: 'c' },
                    d: 'd'
                }
            )).toBe(false);
        });
    });
    describe('find', () => {
        it('should find a queried item', () => {
            const post = new MockPost();

            const mock = new MockCollection<DbPost>();
            mock.data.push(post);

            expect(mock.find({ author: post.author }).internalArray).toContain(post);
        });
        it('should find multiple queried items', () => {
            const author = 'hello';
            const mock = new MockCollection<DbPost>();
            mock.data.push(...fillArray(3, () => new MockPost(author)), ...fillArray(7, () => new MockPost));
            expect(mock.find({ author }).internalArray).toEqual(expect.arrayContaining([expect.objectContaining({ author })]));
        });
    });
    describe('deleteMany', () => {
        it('should delete an entry', async done => {
            const post = new MockPost('quirky-name-quirk-quirk');
            const mock = new MockCollection<DbPost>();
            mock.data.push(post);
            await mock.deleteMany({ author: post.author });
            expect(mock.data).not.toContainEqual(post);

            done();
        });
        it('should delete many entries', async done => {
            const author = 'ride';
            const mock = new MockCollection<MockPost>();
            mock.data.push(...fillArray(10, () => new MockPost(author)));

            await mock.deleteMany({ author });
            expect(mock.data).not.toContainEqual(expect.objectContaining({ author }));

            done();
        });
    });
});
