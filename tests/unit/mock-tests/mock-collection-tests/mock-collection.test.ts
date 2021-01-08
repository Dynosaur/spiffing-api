import { DbPost } from 'database/data-types';
import { ObjectId } from 'mongodb';
import { MockCollection } from 'tests/mock';

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
