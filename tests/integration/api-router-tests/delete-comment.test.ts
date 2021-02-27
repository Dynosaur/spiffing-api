import { ObjectId } from 'mongodb';
import { UserWrapper } from 'database/user/wrapper';
import { BoundPost } from 'database/dbi/post-actions';
import { DbComment } from 'database/comment/comment';
import { deleteComment } from 'router/api-router';
import { IDeleteComment } from 'interface/responses/api-responses';
import { encodeBasicAuth } from 'tools/auth';
import { IntegrationEnvironment } from 'tests/mock/integration/integration-environment';
import { INoCommentFoundError, IUnauthenticatedError, IUnauthorizedError } from 'interface/responses/error-responses';

describe('deleteComment route handler', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    let post: BoundPost;
    beforeEach(async done => {
        env = new IntegrationEnvironment('delete-comment');
        await env.initialize();
        user = await env.generateUser();
        post = (await env.generatePosts(1, user._id))[0];
        done();
    });
    afterEach(async done => {
        await env.closeConnections();
        done();
    });
    it('should require authorization', async done => {
        let response = await env.executeRouteHandler(deleteComment);
        expect(response.payload).toStrictEqual<IUnauthenticatedError>({
            ok: false,
            error: 'Unauthenticated'
        });
        env.request.headers.authorization = encodeBasicAuth(user.username, '!password');
        response = await env.executeRouteHandler(deleteComment);
        expect(response.payload).toStrictEqual<IUnauthorizedError>({
            ok: false,
            error: 'Unauthorized'
        });
        const comment = await env.comments.api.create(user._id, 'Content', 'post', post.getObjectId());
        const otherUser = await env.generateUser();
        env.request.params.commentId = comment._id.toHexString();
        env.request.headers.authorization = encodeBasicAuth(otherUser.username, 'password');
        response = await env.executeRouteHandler(deleteComment);
        expect(response.payload).toStrictEqual<IUnauthorizedError>({
            ok: false,
            error: 'Unauthorized'
        });
        done();
    });
    describe('authorized', () => {
        beforeEach(() => {
            env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
        });
        it('should check that the comment exists', async done => {
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<INoCommentFoundError>({
                error: 'No Comment Found',
                ok: false,
                id: undefined as any
            });
            done();
        });
        it('should delete a comment', async done => {
            const comment = await env.comments.api.create(user._id, 'Content', 'post', post.getObjectId());
            env.request.params.commentId = comment._id.toHexString();
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IDeleteComment.Success>({
                ok: true,
                fullyDeleted: true
            });
            expect(await env.actions.comment.get(comment._id.toHexString())).toBeNull();
            await post.sync();
            expect(post.getComments().length).toBe(0);
            done();
        });
        it('shouldn\'t fully delete the comment if there are subcomments', async done => {
            const comment = await env.comments.api.create(user._id, 'Content', 'post', post.getObjectId());
            const subcomment = await env.comments.api.create(user._id, 'Content', 'comment', comment._id);
            env.request.params.commentId = comment._id.toHexString();
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IDeleteComment.Success>({
                ok: true,
                fullyDeleted: false
            });
            expect(await env.comments.db.findOne({ _id: comment._id })).toStrictEqual<DbComment>({
                _id: expect.any(ObjectId),
                author: null as any,
                content: null as any,
                dislikes: 0,
                likes: 0,
                parent: {
                    _id: post.getObjectId(),
                    contentType: 'post'
                },
                replies: [subcomment._id]
            });
            await post.sync();
            expect(post.getComments()).toContainEqual(comment._id);
            // expect(comment.replies).toContainEqual(subcomment._id);
            expect(await env.comments.db.findOne({ _id: comment._id })).toStrictEqual<DbComment>({
                _id: comment._id,
                author: null!,
                content: null!,
                dislikes: 0,
                likes: 0,
                parent: {
                    _id: post.getObjectId(),
                    contentType: 'post'
                },
                replies: [subcomment._id]
            });
            done();
        });
    });
});
