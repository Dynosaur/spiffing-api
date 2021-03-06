import { ICreatePost, createPost } from 'router/post/create';
import { DbPost } from 'database/post';
import { IMissing } from 'interface/error/missing';
import { IUnauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized } from 'interface/error/unauthorized';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { ObjectId } from 'mongodb';
import { UserWrapper } from 'database/user';
import { encodeBasicAuth } from 'tools/auth';

describe('create-post route handler', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    beforeEach(async done => {
        env = new IntegrationEnvironment('create-post');
        await env.initialize();
        user = await env.generateUser();
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    describe('authorization', () => {
        it('should require authentication', async done => {
            const response = await env.executeRouteHandler(createPost);
            expect(response.payload).toStrictEqual<IUnauthenticated>({
                error: 'Unauthenticated',
                ok: false
            });
            done();
        });
        it('should require authorization', async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, 'notYourPassword');
            env.request.body.content = 'Friday I\'m In Love';
            env.request.body.title = 'Garden Song';
            const response = await env.executeRouteHandler(createPost);
            expect(response.payload).toStrictEqual<IUnauthorized>({
                error: 'Unauthorized',
                ok: false
            });
            done();
        });
    });
    describe('request body', () => {
        it('should require content', async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            const response = await env.executeRouteHandler(createPost);
            expect(response.payload).toStrictEqual<IMissing>({
                error: 'Missing Item',
                field: 'body',
                name: 'content',
                ok: false
            });
            done();
        });
        it('should require content', async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            env.request.body.title = 'Halloween';
            const response = await env.executeRouteHandler(createPost);
            expect(response.payload).toStrictEqual<IMissing>({
                error: 'Missing Item',
                field: 'body',
                name: 'content',
                ok: false
            });
            done();
        });
        it('should require title', async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            env.request.body.content = 'Halloween';
            const response = await env.executeRouteHandler(createPost);
            expect(response.payload).toStrictEqual<IMissing>({
                error: 'Missing Item',
                field: 'body',
                name: 'title',
                ok: false
            });
            done();
        });
    });
    it('should create post', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        const content = 'Whatever you want.';
        const title = 'DVD';
        env.request.body.content = content;
        env.request.body.title = title;
        const response = await env.executeRouteHandler(createPost);
        expect(response.payload).toStrictEqual<ICreatePost.Success>({
            ok: true,
            post: {
                _id: expect.stringMatching(/[a-f\d]{24}/),
                author: user.id,
                comments: [],
                content,
                date: expect.any(Number),
                dislikes: 0,
                likes: 0,
                title
            }
        });
        const _id = new ObjectId((response.payload as ICreatePost.Success).post._id);
        expect(await env.db.collection.posts.findOne({ _id })).toStrictEqual<DbPost>({
            _id,
            author: user._id,
            comments: [],
            content,
            dislikes: 0,
            likes: 0,
            title
        });
        done();
    });
});
