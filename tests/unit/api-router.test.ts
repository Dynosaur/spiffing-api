import { fillArray } from '../tools';
import { convertDbUser } from '../../src/database';
import { getPost, getPosts, getUser, createPost } from '../../src/server/router/api-router';
import { MockEnvironment, MockPost, testUsername } from '../mock';

describe('api route handlers', () => {
    describe('getUser', () => {
        it('should return user data', async done => {
            const mock = new MockEnvironment({ userFill: 3 });
            const mockUser = mock.createUser();
            mock.request.params.username = mockUser.username;

            const resp = await mock.runRouteHandler(getUser);
            expect(resp.payload).toStrictEqual({ status: 'OK', user: convertDbUser(mockUser) });
            expect((resp.payload as any).user.password).toBeUndefined();
            expect(mock.users.findSpy).toBeCalledWith({ username: mockUser.username });

            done();
        });
        it('should return an error when no user is found', async done => {
            const queriedUsername = 'hello';

            const mock = new MockEnvironment({ userFill: 5 });
            mock.request.params.username = queriedUsername;

            const resp = await mock.runRouteHandler(getUser);
            expect(resp.payload).toStrictEqual({ status: 'NOT_FOUND' });
            expect(mock.users.findSpy).toBeCalledWith({ username: queriedUsername });

            done();
        });
    });
    describe('getPosts', () => {
        it('should return all posts', async done => {
            const mock = new MockEnvironment({ postFill: 10 });

            const resp = await mock.runRouteHandler(getPosts);
            expect(resp.payload).toStrictEqual({ status: 'OK', posts: mock.posts.data });
            expect(mock.posts.findSpy).toBeCalledWith({ });

            done();
        });
        it('should correctly find queried posts', async done => {
            const username = testUsername();
            const correctPosts = fillArray(3, () => new MockPost(username));

            const mock = new MockEnvironment({ postFill: 7 });
            mock.posts.data.push(...correctPosts);
            mock.request.query.author = username;

            const resp = await mock.runRouteHandler(getPosts);
            expect(resp.payload).toStrictEqual({ status: 'OK', posts: correctPosts });
            expect(mock.posts.findSpy).toBeCalledWith({ author: username });

            done();
        });
    });
    describe('getPost', () => {
        it('should find post', async done => {
            const post = new MockPost();

            const mock = new MockEnvironment({ postFill: 4 });
            mock.posts.data.push(post);
            mock.request.params.id = post._id;

            const resp = await mock.runRouteHandler(getPost);
            expect(mock.posts.findSpy).toBeCalledWith({ _id: post._id });
            expect(resp.payload).toStrictEqual({ status: 'OK', post });

            done();
        });
        it('should respond with an error if the post cannot be found', async done => {
            const mock = new MockEnvironment();
            mock.request.params.id = 'random-id';

            const resp = await mock.runRouteHandler(getPost);
            expect(resp.payload).toStrictEqual({ status: 'NOT_FOUND' });

            done();
        });
    });
    describe('createPost', () => {
        it('should create a post', async done => {
            const author = 'me';
            const content = 'Some random content for the post and it will be stored in the database.';
            const title = 'My post in the database wow';

            const mock = new MockEnvironment();
            mock.request.body.author = author;
            mock.request.body.content = content;
            mock.request.body.title = title;

            const resp = await mock.runRouteHandler(createPost);
            expect(resp.payload).toStrictEqual({ status: 'CREATED' });
            expect(mock.posts.data.length).toBe(1);
            expect(mock.posts.data[0]).toMatchObject({ author, content, title });

            done();
        });
    });
});
