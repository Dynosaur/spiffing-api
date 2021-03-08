import { ObjectId } from 'mongodb';
import { CommentAPI, DbComment }  from 'database/comment';
import { DbPost, PostWrapper }    from 'database/post';
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

describe('delete-comment route handler', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    let post: PostWrapper;
    let commentApi: CommentAPI;
    beforeEach(async done => {
        env = new IntegrationEnvironment('delete-comment');
        await env.initialize();
        user = await env.generateUser();
        post = await env.generatePost(user._id);
        commentApi = env.api.comment;
        done();
    });
    afterEach(async done => {
        await env.destroy();
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
        const comment = await env.api.comment.create(user._id, 'Content', 'post', post._id);
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
                id: undefined!
            });
            done();
        });
        it('should delete a comment', async done => {
            const comment = await env.api.comment.create(user._id, 'Content', 'post', post._id);
            env.request.params.commentId = comment._id.toHexString();
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IDeleteComment.Success>({
                ok: true,
                fullyDeleted: true
            });
            expect(await env.actions.comment.get(comment._id.toHexString())).toBeNull();
            expect(await env.db.collection.posts.findOne({ _id: post._id })).toStrictEqual<DbPost>({
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
            const comment = await commentApi.create(user._id, 'Content', 'post', post._id);
            const subcomment = await commentApi.create(user._id, 'Content', 'comment', comment._id);
            env.request.params.commentId = comment._id.toHexString();
            const response = await env.executeRouteHandler(deleteComment);
            expect(response.payload).toStrictEqual<IDeleteComment.Success>({
                ok: true,
                fullyDeleted: false
            });
            expect(await env.db.collection.comments.findOne({ _id: comment._id })).toStrictEqual<DbComment>({
                _id: expect.any(ObjectId),
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
            expect(await env.db.collection.posts.findOne({ _id: post._id })).toStrictEqual<DbPost>({
                _id: expect.anything(),
                author: expect.anything(),
                comments: [comment._id],
                content: expect.anything(),
                dislikes: expect.anything(),
                likes: expect.anything(),
                title: expect.anything()
            });
            expect(await env.db.collection.comments.findOne({ _id: comment._id })).toStrictEqual<DbComment>({
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
