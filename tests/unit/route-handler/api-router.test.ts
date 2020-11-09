import { MockPost, MockUser, testUsername } from '../../mock';
import { getPost, getPosts, getUser, createPost } from '../../../src/server/router/api-router';
import { createMocks, fillArray, fillPosts,runRouteHandler } from '../../tools';


describe('api route handlers', () => {
    describe('getUser', () => {
        test('should return user data', async done => {
            const mockUser = new MockUser();

            const mock = createMocks(3);
            mock.users.data.push(mockUser);
            mock.req.params.username = mockUser.username;

            const resp = await runRouteHandler(getUser, mock);
            expect(resp.payload).toStrictEqual({ status: 'OK', user: mockUser });
            expect((resp.payload as any).user.password).toBeUndefined();
            expect(mock.users.findSpy).toBeCalledWith({ username: mockUser.username });

            done();
        });
        test('should return an error when no user is found', async done => {
            const queriedUsername = 'hello';

            const mock = createMocks(5);
            mock.req.params.username = queriedUsername;

            const resp = await runRouteHandler(getUser, mock);
            expect(resp.payload).toStrictEqual({ status: 'NOT_FOUND' });
            expect(mock.users.findSpy).toBeCalledWith({ username: queriedUsername });

            done();
        });
    });
    describe('getPosts', () => {
        test('should return all posts', async done => {
            const mockPosts = fillPosts(10);

            const mock = createMocks();
            mock.posts.data.push(...mockPosts);

            const resp = await runRouteHandler(getPosts, mock);
            expect(resp.payload).toStrictEqual({ status: 'OK', posts: mockPosts });
            expect(mock.posts.findSpy).toBeCalledWith({ });

            done();
        });
        test('should correctly find queried posts', async done => {
            const username = testUsername();

            const correctPosts = fillPosts(3, username);

            const mock = createMocks(0, 7);
            mock.posts.data.push(...correctPosts);
            mock.req.query.author = username;

            const resp = await runRouteHandler(getPosts, mock);
            expect(resp.payload).toStrictEqual({ status: 'OK', posts: correctPosts });
            expect(mock.posts.findSpy).toBeCalledWith({ author: username });

            done();
        });
    });
    describe('getPost', () => {
        test('should find post', async done => {
            const post = new MockPost();

            const mock = createMocks(0, 4);
            mock.posts.data.push(post);
            mock.req.params.id = post._id;

            const resp = await runRouteHandler(getPost, mock);
            expect(resp.payload).toStrictEqual({ status: 'OK', post });
            expect(mock.posts.findSpy).toBeCalledWith({ _id: post._id });

            done();
        });
        test('should respond with an error if the post cannot be found', async done => {
            const mock = createMocks();
            mock.req.params.id = 'random-id';

            const resp = await runRouteHandler(getPost, mock);
            expect(resp.payload).toStrictEqual({ status: 'NOT_FOUND' });

            done();
        });
    });
    describe('createPost', () => {
        test('should create a post', async done => {
            const author = 'me';
            const content = 'Some random content for the post and it will be stored in the database.';
            const title = 'My post in the database wow';

            const mock = createMocks();
            mock.req.body.author = author;
            mock.req.body.content = content;
            mock.req.body.title = title;

            const resp = await runRouteHandler(createPost, mock);
            expect(resp.payload).toStrictEqual({ status: 'CREATED' });
            expect(mock.posts.data.length).toBe(1);
            expect(mock.posts.data[0]).toMatchObject({ author, content, title });

            done();
        });
    });
});
