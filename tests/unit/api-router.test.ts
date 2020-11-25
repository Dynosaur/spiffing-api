import { fillArray } from '../tools/array';
import { convertDbUser } from '../../src/database/database-actions';
import { getPost, getPosts, getUser, createPost } from '../../src/server/router/api-router';
import { MockEnvironment, MockPost, testUsername } from '../mock';
import { GetPostErrorResponse, GetPostFoundResponse, GetPostsEndpoint, GetUserEndpoint }
from '../../src/server/interface/responses/api-responses';

describe('api route handlers', () => {
    describe('getUser', () => {
        it('should return user data', async done => {
            const mock = new MockEnvironment({ userFill: 3 });
            const mockUser = mock.createUser();
            mock.request.params.username = mockUser.username;

            const resp = await mock.runRouteHandler(getUser);
            expect(resp.payload).toStrictEqual<GetUserEndpoint>({
                ok: true,
                user: convertDbUser(mockUser)
            });
            expect((resp.payload as any).user.password).toBeUndefined();

            done();
        });
        it('should return an error when no user is found', async done => {
            const queriedUsername = 'hello';

            const mock = new MockEnvironment({ userFill: 5 });
            mock.request.params.username = queriedUsername;

            const resp = await mock.runRouteHandler(getUser);
            expect(resp.payload).toStrictEqual<GetUserEndpoint>({
                error: 'User Not Found',
                ok: false
            });
            expect(mock.users.findSpy).toBeCalledWith({ username: queriedUsername });

            done();
        });
    });
    describe('getPosts', () => {
        it('should return all posts', async done => {
            const mock = new MockEnvironment({ postFill: 10 });

            const resp = await mock.runRouteHandler(getPosts);
            expect(mock.posts.findSpy).toBeCalledWith({ });
            expect(resp.payload).toStrictEqual<GetPostsEndpoint>({
                ok: true,
                posts: mock.posts.data as any
            });

            done();
        });
        it('should correctly find queried posts', async done => {
            const username = testUsername();
            const correctPosts = fillArray(3, () => new MockPost(username));

            const mock = new MockEnvironment({ postFill: 7 });
            mock.posts.data.push(...correctPosts);
            mock.request.query.author = username;

            const resp = await mock.runRouteHandler(getPosts);
            expect(mock.posts.findSpy).toBeCalledWith({ author: username });
            expect(resp.payload).toStrictEqual<GetPostsEndpoint>({
                ok: true,
                posts: correctPosts as any
            });

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
            expect(resp.payload).toStrictEqual<GetPostFoundResponse>({
                ok: true,
                post: post as any
            });

            done();
        });
        it('should respond with an error if the post cannot be found', async done => {
            const mock = new MockEnvironment();
            mock.request.params.id = 'random-id';

            const resp = await mock.runRouteHandler(getPost);
            expect(mock.posts.findSpy).toBeCalledWith({ _id: 'random-id' });
            expect(resp.payload).toStrictEqual<GetPostErrorResponse>({
                error: 'Post Not Found',
                ok: false
            });

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
            expect(mock.posts.data.length).toBe(1);
            expect(mock.posts.data[0]).toMatchObject({ author, content, title });
            expect(resp.payload).toMatchObject({
                ok: true,
                post: {
                    author,
                    content,
                    title
                }
            });

            done();
        });
    });
});
