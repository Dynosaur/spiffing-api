import { ObjectId } from 'mongodb';
import { UserWrapper }            from 'database/user';
import { rateComment }            from 'router/rate-comment';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { encodeBasicAuth }        from 'tools/auth';
import {
    IMissingDataError,
    INoCommentFoundError,
    IObjectIdParseError,
    IUnauthenticatedError,
    IUnauthorizedError
} from 'interface/responses/error-responses';
import { CommentWrapper } from 'database/comment';
import { IRateComment } from 'interface/responses/api-responses';
import { PostWrapper } from 'database/post';

describe('rate-comment route handler integration', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    beforeEach(async done => {
        env = new IntegrationEnvironment('rate-comment');
        await env.initialize();
        user = await env.generateUser();
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    it('should require authentication', async done => {
        const response = await env.executeRouteHandler(rateComment);
        expect(response.payload).toStrictEqual<IUnauthenticatedError>({
            ok: false,
            error: 'Unauthenticated'
        });
        done();
    });
    it('should require request body field \'rating\'', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        const response = await env.executeRouteHandler(rateComment);
        expect(response.payload).toStrictEqual<IMissingDataError>({
            ok: false,
            error: 'Missing Data',
            missing: {
                'scope-name': 'body',
                received: [],
                required: ['rating']
            }
        });
        done();
    });
    it('should require authorization', async done => {
        env.request.body.rating = 1;
        env.request.headers.authorization = encodeBasicAuth(user.username, '!password');
        const response = await env.executeRouteHandler(rateComment);
        expect(response.payload).toStrictEqual<IUnauthorizedError>({
            ok: false,
            error: 'Unauthorized'
        });
        done();
    });
    it('should require id to be parsable to an ObjectId', async done => {
        env.request.body.rating = 1;
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        env.request.params.id = 'random';
        const response = await env.executeRouteHandler(rateComment);
        expect(response.payload).toStrictEqual<IObjectIdParseError>({
            ok: false,
            error: 'Object Id Parse',
            provided: 'random'
        });
        done();
    });
    it('should require comment to exist', async done => {
        env.request.body.rating = 1;
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        const commentId = new ObjectId().toHexString();
        env.request.params.id = commentId;
        const response = await env.executeRouteHandler(rateComment);
        expect(response.payload).toStrictEqual<INoCommentFoundError>({
            ok: false,
            error: 'No Comment Found',
            id: commentId
        });
        done();
    });
    describe('ratings result', () => {
        let post: PostWrapper;
        let comment: CommentWrapper;
        beforeEach(async done => {
            post = await env.generatePost(user._id);
            comment = await env.generateComment(user._id, 'post', post._id);
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            env.request.params.id = comment.id;
            done();
        });
        it('should like an unrated comment', async done => {
            env.request.body.rating = 1;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                ok: true,
                change: true
            });
            done();
        });
        it('should like a liked comment', async done => {
            env.request.body.rating = 1;
            await env.executeRouteHandler(rateComment);
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                ok: true,
                change: false
            });
            done();
        });
        it('should like a disliked comment', async done => {
            env.request.body.rating = -1;
            await env.executeRouteHandler(rateComment);
            env.request.body.rating = 1;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                ok: true,
                change: true
            });
            done();
        });
        it('should disliked an unrated comment', async done => {
            env.request.body.rating = -1;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                ok: true,
                change: true
            });
            done();
        });
        it('should dislike a disliked comment', async done => {
            env.request.body.rating = -1;
            await env.executeRouteHandler(rateComment);
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                ok: true,
                change: false
            });
            done();
        });
        it('should dislike a liked comment', async done => {
            env.request.body.rating = 1;
            await env.executeRouteHandler(rateComment);
            env.request.body.rating = -1;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                ok: true,
                change: true
            });
            done();
        });
        it('should unrate an unrated comment', async done => {
            env.request.body.rating = 0;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                ok: true,
                change: false
            });
            done();
        });
        it('should unrate a liked comment', async done => {
            env.request.body.rating = 1;
            await env.executeRouteHandler(rateComment);
            env.request.body.rating = 0;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                ok: true,
                change: true
            });
            done();
        });
        it('should unrate a disliked comment', async done => {
            env.request.body.rating = -1;
            await env.executeRouteHandler(rateComment);
            env.request.body.rating = 0;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                ok: true,
                change: true
            });
            done();
        });
    });
});
