import { ObjectId } from 'mongodb';
import { DbComment } from 'database/comment';
import { UserWrapper } from 'database/user';
import { deleteComment } from 'router/api-router';
import { IDeleteComment } from 'interface/responses/api-responses';
import { encodeBasicAuth } from 'tools/auth';
import { DbPost, PostWrapper } from 'database/post';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { INoCommentFoundError, IUnauthenticatedError, IUnauthorizedError } from 'interface/responses/error-responses';

describe('deleteComment route handler', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    let post: PostWrapper;
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
        const comment = await env.comments.api.create(user._id, 'Content', 'post', post._id);
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
            const comment = await env.comments.api.create(user._id, 'Content', 'post', post._id);
            env.request.params.commentId = comment._id.toHexString();
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IDeleteComment.Success>({
                ok: true,
                fullyDeleted: true
            });
            expect(await env.actions.comment.get(comment._id.toHexString())).toBeNull();
            expect(await env.posts.db.findOne({ _id: post._id })).toStrictEqual<DbPost>({
                _id: expect.anything(),
                author: expect.anything(),
                comments: [],
                content: expect.anything(),
                dislikes: expect.anything(),
                likes: expect.anything(),
                title: expect.anything()
            });
            done();
        });
        it('shouldn\'t fully delete the comment if there are subcomments', async done => {
            const comment = await env.comments.api.create(user._id, 'Content', 'post', post._id);
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
                    _id: post._id,
                    contentType: 'post'
                },
                replies: [subcomment._id]
            });
            expect(await env.posts.db.findOne({ _id: post._id })).toStrictEqual<DbPost>({
                _id: expect.anything(),
                author: expect.anything(),
                comments: [comment._id],
                content: expect.anything(),
                dislikes: expect.anything(),
                likes: expect.anything(),
                title: expect.anything()
            });
            expect(await env.comments.db.findOne({ _id: comment._id })).toStrictEqual<DbComment>({
                _id: comment._id,
                author: null!,
                content: null!,
                dislikes: 0,
                likes: 0,
                parent: {
                    _id: post._id,
                    contentType: 'post'
                },
                replies: [subcomment._id]
            });
            done();
        });
    });
});
