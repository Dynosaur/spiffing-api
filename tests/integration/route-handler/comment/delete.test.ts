import { ObjectId } from 'mongodb';
import { PostWrapper }                   from 'database/post';
import { UserWrapper }                   from 'database/user';
import { deleteComment, IDeleteComment } from 'router/comment/delete';
import { IntegrationEnvironment }        from 'tests/mock/integration-environment';
import { encodeBasicAuth }               from 'tools/auth';
import { IContentNotFound }              from 'interface/error/content-not-found';
import { IUnauthenticated }              from 'interface/error/unauthenticated';
import { IUnauthorized }                 from 'interface/error/unauthorized';

describe('delete-comment route handler', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    beforeEach(async done => {
        env = new IntegrationEnvironment('delete-comment');
        await env.initialize();
        user = await env.generateUser();
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    it('should require authentication', async done => {
        const response = await env.executeRouteHandler(deleteComment);
        expect(response.payload).toStrictEqual<IUnauthenticated>({
            ok: false,
            error: 'Unauthenticated'
        });
        done();
    });
    it('should require authorization', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, '!password');
        const response = await env.executeRouteHandler(deleteComment);
        expect(response.payload).toStrictEqual<IUnauthorized>({
            ok: false,
            error: 'Unauthorized'
        });
        done();
    });
    describe('requires post', () => {
        let post: PostWrapper;
        beforeEach(async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
            post = await env.generatePost(user._id);
            done();
        });
        it('should require authorization from author of comment', async done => {
            const comment = await env.api.comment.create(user._id, 'Content', 'post', post._id);
            const otherUser = await env.generateUser();
            env.request.params.id = comment.id;
            env.request.headers.authorization = encodeBasicAuth(otherUser.username, env.defaultPassword);
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IUnauthorized>({
                ok: false,
                error: 'Unauthorized'
            });
            done();
        });
        it('should check that the comment exists', async done => {
            const id = new ObjectId().toHexString();
            env.request.params.id = id;
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IContentNotFound>({
                content: 'Comment',
                error: 'Content Not Found',
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
