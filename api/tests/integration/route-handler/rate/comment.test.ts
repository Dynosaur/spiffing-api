import { IRateComment, rateComment } from 'router/rate/comment';
import { CommentWrapper } from 'database/comment';
import { IContentNotFound } from 'interface/error/content-not-found';
import { IMissing } from 'interface/error/missing';
import { IObjectIdParse } from 'interface/error/object-id-parse';
import { IUnauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized } from 'interface/error/unauthorized';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { ObjectId } from 'mongodb';
import { PostWrapper } from 'database/post';
import { UserWrapper } from 'database/user';
import { encodeBasicAuth } from 'tools/auth';

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
        expect(response.payload).toStrictEqual<IUnauthenticated>({
            error: 'Unauthenticated',
            ok: false
        });
        done();
    });
    it('should require request body field \'rating\'', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        const response = await env.executeRouteHandler(rateComment);
        expect(response.payload).toStrictEqual<IMissing>({
            error: 'Missing Item',
            field: 'body',
            name: 'rating',
            ok: false
        });
        done();
    });
    it('should require authorization', async done => {
        env.request.body.rating = 1;
        env.request.headers.authorization = encodeBasicAuth(user.username, '!password');
        const response = await env.executeRouteHandler(rateComment);
        expect(response.payload).toStrictEqual<IUnauthorized>({
            error: 'Unauthorized',
            ok: false
        });
        done();
    });
    it('should require id to be parsable to an ObjectId', async done => {
        env.request.body.rating = 1;
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        env.request.params.id = 'random';
        const response = await env.executeRouteHandler(rateComment);
        expect(response.payload).toStrictEqual<IObjectIdParse>({
            context: 'params.id',
            error: 'Object Id Parse',
            ok: false,
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
        expect(response.payload).toStrictEqual<IContentNotFound>({
            content: 'Comment',
            error: 'Content Not Found',
            id: commentId,
            ok: false
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
                change: true,
                ok: true
            });
            done();
        });
        it('should like a liked comment', async done => {
            env.request.body.rating = 1;
            await env.executeRouteHandler(rateComment);
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                change: false,
                ok: true
            });
            done();
        });
        it('should like a disliked comment', async done => {
            env.request.body.rating = -1;
            await env.executeRouteHandler(rateComment);
            env.request.body.rating = 1;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                change: true,
                ok: true
            });
            done();
        });
        it('should disliked an unrated comment', async done => {
            env.request.body.rating = -1;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                change: true,
                ok: true
            });
            done();
        });
        it('should dislike a disliked comment', async done => {
            env.request.body.rating = -1;
            await env.executeRouteHandler(rateComment);
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                change: false,
                ok: true
            });
            done();
        });
        it('should dislike a liked comment', async done => {
            env.request.body.rating = 1;
            await env.executeRouteHandler(rateComment);
            env.request.body.rating = -1;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                change: true,
                ok: true
            });
            done();
        });
        it('should unrate an unrated comment', async done => {
            env.request.body.rating = 0;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                change: false,
                ok: true
            });
            done();
        });
        it('should unrate a liked comment', async done => {
            env.request.body.rating = 1;
            await env.executeRouteHandler(rateComment);
            env.request.body.rating = 0;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                change: true,
                ok: true
            });
            done();
        });
        it('should unrate a disliked comment', async done => {
            env.request.body.rating = -1;
            await env.executeRouteHandler(rateComment);
            env.request.body.rating = 0;
            const response = await env.executeRouteHandler(rateComment);
            expect(response.payload).toStrictEqual<IRateComment.Success>({
                change: true,
                ok: true
            });
            done();
        });
    });
});
