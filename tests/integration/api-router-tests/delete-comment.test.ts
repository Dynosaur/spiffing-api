import { BoundUser } from 'database/dbi/user-api';
import { BoundPost } from 'database/dbi/post-actions';
import { deleteComment } from 'router/api-router';
import { INoCommentFoundError, IUnauthenticatedError, IUnauthorizedError } from 'interface/responses/error-responses';
import { IntegrationEnvironment } from 'tests/mock/integration/integration-environment';
import { encodeBasicAuth } from 'app/tools/auth';
import { IDeleteComment } from 'app/server/interface/responses/api-responses';
import { DbComment } from 'app/database/data-types/comment';
import { ObjectId } from 'mongodb';

describe('deleteComment route handler', () => {
    let env: IntegrationEnvironment;
    let user: BoundUser;
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
        const comment = await env.comments.api.createComment(user._id, 'Content', post);
        const otherUser = await env.generateUser();
        env.request.params.commentId = comment.getStringId();
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
                id: undefined
            });
            done();
        });
        it('should delete a comment', async done => {
            const comment = await env.comments.api.createComment(user._id, 'Content', post);
            env.request.params.commentId = comment.getStringId();
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IDeleteComment.Success>({
                ok: true,
                fullyDeleted: true
            });
            expect(await env.actions.comment.readComment(comment.getStringId())).toBeNull();
            await post.sync();
            expect(post.getComments().length).toBe(0);
            done();
        });
        it('shouldn\'t fully delete the comment if there are subcomments', async done => {
            const comment = await env.comments.api.createComment(user._id, 'Content', post);
            const subcomment = await env.comments.api.createComment(user._id, 'Content', comment);
            env.request.params.commentId = comment.getStringId();
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IDeleteComment.Success>({
                ok: true,
                fullyDeleted: false
            });
            await comment.sync();
            expect(comment.getDbComment()).toStrictEqual<DbComment>({
                _id: expect.any(ObjectId),
                author: null,
                content: null,
                dislikes: 0,
                likes: 0,
                parent: {
                    _id: post.getObjectId(),
                    contentType: 'post'
                },
                replies: [subcomment.getObjectId()]
            });
            await post.sync();
            expect(post.getComments()).toContainEqual(comment.getObjectId());
            expect(comment.getReplies()).toContainEqual(subcomment.getObjectId());
            done();
        });
    });
});
