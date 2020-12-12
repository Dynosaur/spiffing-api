import { DbPost } from 'database/data-types';
import { ObjectId } from 'mongodb';
import { MockCollection, asymmetricalMatch } from 'tests/mock';

function mockPost(id = new ObjectId(), author = new ObjectId()): DbPost {
    return {
        _id: id,
        author,
        comments: [],
        content: 'Meadowlands',
        dislikes: 0,
        likes: 0,
        title: 'Hopeless'
    };
}

function mockPosts(length: number, author: ObjectId = undefined): DbPost[] {
    return new Array(length).fill(null).map(() => mockPost(undefined, author));
}

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
        it('should continue checking after the first recursion', () => {
            const model = {
                a: {
                    b: 'b',
                    c: 'c'
                },
                b: 'b'
            };
            const subject = {
                a: {
                    b: 'b',
                    c: 'c'
                },
                b: 'z'
            };
            expect(asymmetricalMatch(model, subject)).toBe(false);
        });
        it('should not get a false-negative from falsy values', () => {
            const model = { a: 0 };
            const subject = { a: 0 };
            expect(asymmetricalMatch(model, subject)).toBe(true);
        });
    });
    describe('find', () => {
        it('should call findSpy', () => {
            const mock = new MockCollection<DbPost>();
            const post = mockPost();
            mock.data.push(post);

            mock.find({ _id: post._id });
            expect(mock.findSpy).toBeCalledWith({ _id: post._id });
        });
        it('should be able to return a single item', () => {
            const mock = new MockCollection<DbPost>();
            const post = mockPost();
            const fientPost = mockPost();
            mock.data.push(post, fientPost);

            const found = mock.find({ _id: post._id })._data;
            expect(found).toContain(post);
            expect(found).not.toContain(fientPost);
        });
        it('should be able to return multiple items', () => {
            const mock = new MockCollection<DbPost>();
            const author = new ObjectId();
            const posts = mockPosts(3, author);
            const fientPosts = mockPosts(7);
            mock.data.push(...posts, ...fientPosts);

            const found = mock.find({ author })._data;
            expect(found).toEqual(expect.arrayContaining(posts));
            expect(found).not.toEqual(expect.arrayContaining(fientPosts));
        });
    });
    describe('deleteMany', () => {
        it('should call deleteManySpy', () => {
            const mock = new MockCollection<DbPost>();

            mock.deleteMany({ likes: 4 });
            expect(mock.deleteManySpy).toBeCalledWith({ likes: 4 });
        });
        it('should be able to delete a single entry', async done => {
            const mock = new MockCollection<DbPost>();
            const post = mockPost();
            const fientPost = mockPost();
            mock.data.push(post, fientPost);

            await mock.deleteMany({ _id: post._id });
            expect(mock.data).not.toContain(post);
            expect(mock.data).toContain(fientPost);

            done();
        });
        it('should be able to delete multiple entries', async done => {
            const mock = new MockCollection<DbPost>();
            const author = new ObjectId();
            const posts = mockPosts(3, author);
            const fientPosts = mockPosts(7);
            mock.data.push(... posts, ...fientPosts);

            await mock.deleteMany({ author });
            expect(mock.data).not.toEqual(expect.arrayContaining(posts));
            expect(mock.data).toEqual(expect.arrayContaining(fientPosts));

            done();
        });
    });
});
