import { DbPost } from 'database/post';
import { ObjectId } from 'mongodb';
import { createPost } from 'router/api-router';
import { UserWrapper } from 'database/user';
import { ICreatePost } from 'interface/responses/api-responses';
import { encodeBasicAuth } from 'tools/auth';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { IMissingDataError, IUnauthenticatedError, IUnauthorizedError } from 'interface/responses/error-responses';

describe('createPost route handler', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    beforeEach(async done => {
        env = new IntegrationEnvironment('createPost');
        await env.initialize();
        user = await env.generateUser();
        done();
    });
    afterEach(async done => {
        await env.closeConnections();
        done();
    });
    describe('authorization', () => {
        it('should require authentication', async done => {
            const response = await env.executeRouteHandler(createPost);
            expect(response.payload).toStrictEqual<IUnauthenticatedError>({
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
            expect(response.payload).toStrictEqual<IUnauthorizedError>({
                error: 'Unauthorized',
                ok: false
            });
            done();
        });
    });
    describe('request body', () => {
        it('should require content and title', async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            const response = await env.executeRouteHandler(createPost);
            expect(response.payload).toStrictEqual<IMissingDataError>({
                error: 'Missing Data',
                missing: {
                    received: [],
                    required: ['content', 'title'],
                    'scope-name': 'body'
                },
                ok: false
            });
            done();
        });
        it('should require content', async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            env.request.body.title = 'Halloween';
            const response = await env.executeRouteHandler(createPost);
            expect(response.payload).toStrictEqual<IMissingDataError>({
                error: 'Missing Data',
                missing: {
                    received: ['title'],
                    required: ['content'],
                    'scope-name': 'body'
                },
                ok: false
            });
            done();
        });
        it('should require title', async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            env.request.body.content = 'Halloween';
            const response = await env.executeRouteHandler(createPost);
            expect(response.payload).toStrictEqual<IMissingDataError>({
                error: 'Missing Data',
                missing: {
                    received: ['content'],
                    required: ['title'],
                    'scope-name': 'body'
                },
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
        const _id = new ObjectId((response.payload as any).post._id);
        expect(await env.posts.db.findOne({ _id })).toStrictEqual<DbPost>({
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
