import { Post } from 'interface/data-types';
import { DbPost } from 'app/database/data-types';
import { ObjectId } from 'mongodb';
import { convertDbPost } from 'database/data-types';
import { MockEnvironment } from 'tests/mock/mock-environment';
import { createPost, getPost, getPosts, getUser } from 'server/router/api-router';
import { CreatePost, GetPosts, GetPost, GetUser } from 'interface/responses/api-responses';

describe('api route handlers', () => {
    describe('getUser', () => {
        it('should return user data', async done => {
            const mock = new MockEnvironment({ userFill: 3 });
            const username = 'hello';
            mock.createUser(username);
            mock.request.params.username = username;

            const resp = await mock.runRouteHandler(getUser);
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(resp.payload).toStrictEqual<GetUser.Ok.UserFound>({
                ok: true,
                user: {
                    _id: expect.stringMatching(/[a-f\d]{24}/),
                    created: expect.any(Number),
                    screenname: username,
                    username
                }
            });

            done();
        });
        it('should return an error when no user is found', async done => {
            const mock = new MockEnvironment({ userFill: 5 });
            const queriedUsername = 'hello';
            mock.request.params.username = queriedUsername;

            const response = await mock.runRouteHandler(getUser);
            expect(mock.users.findSpy).toBeCalledWith({ username: queriedUsername });
            expect(response.payload).toStrictEqual<GetUser.Failed.UserNotFound>({
                error: 'User Not Found',
                ok: false
            });

            done();
        });
    });
    describe('getPosts', () => {
        it('should return interface posts', async done => {
            const mock = new MockEnvironment({ postFill: 3 });

            const response = await mock.runRouteHandler(getPosts);
            expect(response.payload).toStrictEqual<GetPosts.PostsFound>({
                ok: true,
                posts: expect.arrayContaining([expect.objectContaining<Post>({
                    _id: expect.stringMatching(/[a-f\d]{24}/),
                    author: expect.stringMatching(/[a-f\d]{24}/),
                    comments: [],
                    content: MockEnvironment.defaultContent,
                    date: expect.any(Number),
                    dislikes: 0,
                    likes: 0,
                    title: MockEnvironment.defaultTitle
                })])
            });

            done();
        });
        it('should filter out non-whitelisted queries', async done => {
            const mock = new MockEnvironment();
            mock.request.query.lol = 'Middle America';
            mock.request.query.date = 0;
            mock.request.query.something = 'Lol';

            const response = await mock.runRouteHandler(getPosts);
            expect(mock.posts.findSpy).toBeCalledWith({ date: 0 });
            expect(response.payload).toStrictEqual<GetPosts.PostsFound>({
                ok: true,
                posts: [],
                'query-allowed': ['date'],
                'query-blocked': ['lol', 'something']
            });

            done();
        });
        it('should find queried posts', async done => {
            const mock = new MockEnvironment({ postFill: 7 });
            const user = mock.createUser();
            const correctPosts = mock.generatePosts(6, user._id);
            mock.request.query.author = user._id.toHexString();

            const response = await mock.runRouteHandler(getPosts);
            expect(mock.posts.findSpy).toBeCalledWith({ author: user._id });
            expect(response.payload).toMatchObject<GetPosts.PostsFound>({
                ok: true,
                posts: correctPosts.map(post => convertDbPost(post)),
                'query-allowed': ['author']
            });

            done();
        });
    });
    describe('getPost', () => {
        it('should find post', async done => {
            const mock = new MockEnvironment({ postFill: 4 });
            const post = mock.createPost();
            mock.request.params.id = post._id.toHexString();

            const response = await mock.runRouteHandler(getPost);
            expect(mock.posts.findSpy).toBeCalledWith({ _id: post._id });
            expect(response.payload).toStrictEqual<GetPost.Ok.FoundPost>({
                ok: true,
                post: {
                    _id: expect.stringMatching(/[a-f\d]{24}/),
                    author: expect.stringMatching(/[a-f\d]{24}/),
                    comments: [],
                    content: MockEnvironment.defaultContent,
                    date: expect.any(Number),
                    dislikes: 0,
                    likes: 0,
                    title: MockEnvironment.defaultTitle
                }
            });

            done();
        });
        it('should respond with an error if the post cannot be found', async done => {
            const id = new ObjectId();
            const mock = new MockEnvironment();
            mock.request.params.id = id.toHexString();

            const response = await mock.runRouteHandler(getPost);
            expect(mock.posts.findSpy).toBeCalledWith({ _id: id });
            expect(response.payload).toStrictEqual<GetPost.Failed.NoPost>({
                error: 'Post Not Found',
                ok: false
            });

            done();
        });
    });
    describe('createPost', () => {
        it('should create a post', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();
            const content = 'Some random content for the post and it will be stored in the database.';
            const title = 'My post in the database wow';
            mock.request.body.author = user._id.toHexString();
            mock.request.body.content = content;
            mock.request.body.title = title;

            const response = await mock.runRouteHandler(createPost);
            expect(mock.posts.insertOneSpy).toBeCalled();
            expect(mock.posts.data[0]).toStrictEqual<DbPost>({
                _id: expect.any(ObjectId),
                author: user._id,
                comments: [],
                content,
                dislikes: 0,
                likes: 0,
                title
            });
            expect(response.payload).toStrictEqual<CreatePost.Ok.Created>({
                ok: true,
                post: {
                    _id: expect.stringMatching(/[a-f\d]{24}/),
                    author: user._id.toHexString(),
                    comments: [],
                    content,
                    date: expect.any(Number),
                    dislikes: 0,
                    likes: 0,
                    title
                }
            });

            done();
        });
    });
});
