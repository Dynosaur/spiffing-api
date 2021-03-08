import { PostWrapper }            from 'database/post';
import { UserWrapper }            from 'database/user';
import { IRatePost }              from 'interface/responses/api-responses';
import { ratePost }               from 'router/api-router';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { encodeBasicAuth }        from 'tools/auth';
import {
    IMissingDataError,
    IUnauthenticatedError,
    IUnauthorizedError
} from 'interface/responses/error-responses';

describe('rate-post route handler', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    let posts: PostWrapper[];
    beforeEach(async done => {
        env = new IntegrationEnvironment('rate-post');
        await env.initialize();
        user = await env.generateUser();
        posts = await env.generatePosts(1, user._id);
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    describe('authorization', () => {
        it('should require authentication', async done => {
            const response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IUnauthenticatedError>({
                error: 'Unauthenticated',
                ok: false
            });
            done();
        });
        it('should require authorization', async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, 'notYourPassword');
            env.request.body.rating = 0;
            const response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IUnauthorizedError>({
                error: 'Unauthorized',
                ok: false
            });
            done();
        });
    });
    it('should require body prop \'rating\'', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        const response = await env.executeRouteHandler(ratePost);
        expect(response.payload).toStrictEqual<IMissingDataError>({
            error: 'Missing Data',
            missing: {
                received: [],
                required: ['rating'],
                'scope-name': 'body'
            },
            ok: false
        });
        done();
    });
    describe('likes', () => {
        let post: PostWrapper;
        beforeEach(() => {
            post = posts[0];
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            env.request.body.rating = 1;
            env.request.params.id = post.id;
        });
        it('should like', async done => {
            const response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            done();
        });
        it('should not affect a previously liked post', async done => {
            let response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            done();
        });
        it('should undo a dislike', async done => {
            env.request.body.rating = -1;
            let response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            env.request.body.rating = 1;
            response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            done();
        });
    });
    describe('dislikes', () => {
        let post: PostWrapper;
        beforeEach(() => {
            post = posts[0];
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            env.request.body.rating = -1;
            env.request.params.id = post.id;
        });
        it('should dislike', async done => {
            const response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            done();
        });
        it('should not affect a previously disliked post', async done => {
            let response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            done();
        });
        it('should undo a like', async done => {
            env.request.body.rating = 1;
            let response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            env.request.body.rating = -1;
            response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            done();
        });
    });
});
