import { PostWrapper }            from 'database/post';
import { UserWrapper }            from 'database/user';
import { IDeleteComment }         from 'interface/responses/api-responses';
import { deleteComment }          from 'router/api-router';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { encodeBasicAuth }        from 'tools/auth';
import {
    INoCommentFoundError,
    IUnauthenticatedError,
    IUnauthorizedError
} from 'interface/responses/error-responses';
import { ObjectId } from 'bson';

describe('delete-comment route handler', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    let post: PostWrapper;
    beforeEach(async done => {
        env = new IntegrationEnvironment('delete-comment');
        await env.initialize();
        user = await env.generateUser();
        post = await env.generatePost(user._id);
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    it('should require authentication', async done => {
        const response = await env.executeRouteHandler(deleteComment);
        expect(response.payload).toStrictEqual<IUnauthenticatedError>({
            ok: false,
            error: 'Unauthenticated'
        });
        done();
    });
    it('should require authorization', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, '!password');
        const response = await env.executeRouteHandler(deleteComment);
        expect(response.payload).toStrictEqual<IUnauthorizedError>({
            ok: false,
            error: 'Unauthorized'
        });
        done();
    });
    it('should require authorization from author of comment', async done => {
        const comment = await env.api.comment.create(user._id, 'Content', 'post', post._id);
        const otherUser = await env.generateUser();
        env.request.params.id = comment.id;
        env.request.headers.authorization = encodeBasicAuth(otherUser.username, env.defaultPassword);
        const response = await env.executeRouteHandler(deleteComment);
        expect(response.payload).toStrictEqual<IUnauthorizedError>({
            ok: false,
            error: 'Unauthorized'
        });
        done();
    });
    describe('authorized requests', () => {
        beforeEach(() => {
            env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
        });
        it('should check that the comment exists', async done => {
            const id = new ObjectId().toHexString();
            env.request.params.id = id;
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<INoCommentFoundError>({
                error: 'No Comment Found',
                ok: false,
                id
            });
            done();
        });
        it('should delete a comment', async done => {
            const comment = await env.api.comment.create(user._id, 'Content', 'post', post._id);
            env.request.params.id = comment._id.toHexString();
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IDeleteComment.Success>({
                ok: true,
                fullyDeleted: true
            });
            done();
        });
        it('shouldn\'t fully delete the comment if there are subcomments', async done => {
            const comment = await env.api.comment.create(user._id, 'Content', 'post', post._id);
            await env.api.comment.create(user._id, 'Content', 'comment', comment._id);
            env.request.params.id = comment._id.toHexString();
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IDeleteComment.Success>({
                ok: true,
                fullyDeleted: false
            });
            done();
        });
    });
});
