import { BoundPost } from 'app/database/dbi/post-actions';
import { BoundUser } from 'app/database/dbi/user-api';
import { IPostComment } from 'app/server/interface/responses/api-responses';
import { IMissingDataError, INoCommentFoundError, INoPostFoundError, IUnauthenticatedError, IUnauthorizedError } from 'app/server/interface/responses/error-responses';
import { postComment } from 'app/server/router/api-router';
import { encodeBasicAuth } from 'app/tools/auth';
import { ObjectId } from 'mongodb';
import { IntegrationEnvironment } from 'tests/mock/integration/integration-environment';

describe('postComment route handler', () => {
    let env: IntegrationEnvironment;
    let user: BoundUser;
    let post: BoundPost;
    beforeEach(async done => {
        env = new IntegrationEnvironment('post-comment');
        await env.initialize();
        user = await env.generateUser();
        post = (await env.generatePosts(1, user._id))[0];
        done();
    });
    afterEach(async done => {
        await env.closeConnections();
        done();
    });
    it('should require authentication', async done => {
        let response = await env.executeRouteHandler(postComment);
        expect(response.payload).toStrictEqual<IUnauthenticatedError>({
            ok: false,
            error: 'Unauthenticated'
        });
        env.request.headers.authorization = encodeBasicAuth(user.username, '!password');
        env.request.body.content = '';
        response = await env.executeRouteHandler(postComment);
        expect(response.payload).toStrictEqual<IUnauthorizedError>({
            ok: false,
            error: 'Unauthorized'
        });
        done();
    });
    it('should require content in request body', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
        let response = await env.executeRouteHandler(postComment);
        expect(response.payload).toStrictEqual<IMissingDataError>({
            ok: false,
            error: 'Missing Data',
            missing: {
                'scope-name': 'body',
                received: [],
                required: ['content']
            }
        });
        done();
    });
    it('should check that the parent exists', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
        env.request.params.id = new ObjectId().toHexString();
        env.request.params.contentType = 'post';
        env.request.body.content = 'Content';
        let response = await env.executeRouteHandler(postComment);
        expect(response.payload).toStrictEqual<INoPostFoundError>({
            ok: false,
            error: 'No Post Found',
            id: expect.any(String)
        });
        env.request.params.contentType = 'comment';
        response = await env.executeRouteHandler(postComment);
        expect(response.payload).toStrictEqual<INoCommentFoundError>({
            ok: false,
            error: 'No Comment Found',
            id: expect.any(String)
        });
        done();
    });
    it('should create a comment on a post', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
        env.request.params.contentType = 'post';
        env.request.params.id = post.getIdString();
        env.request.body.content = 'Comment Content';
        const response = await env.executeRouteHandler(postComment);
        expect(response.payload).toStrictEqual<IPostComment.Success>({
            ok: true,
            comment: {
                _id: expect.stringMatching(/^[a-f\d]{24}$/),
                author: user._id.toHexString(),
                content: expect.any(String),
                dislikes: 0,
                likes: 0,
                parent: {
                    _id: post.getIdString(),
                    contentType: 'post'
                },
                replies: []
            }
        });
        await post.sync();
        expect(post.getComments()).toStrictEqual<ObjectId[]>([
            expect.any(ObjectId)
        ]);
        done();
    });
    it('should create a comment on a comment', async done => {
        const parentComment = await env.comments.api.createComment(user._id, 'Content', post);
        env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
        env.request.params.contentType = 'comment';
        env.request.params.id = parentComment.getStringId();
        env.request.body.content = 'Comment Content';
        const response = await env.executeRouteHandler(postComment);
        expect(response.payload).toStrictEqual<IPostComment.Success>({
            ok: true,
            comment: {
                _id: expect.stringMatching(/^[a-f\d]{24}$/),
                author: user._id.toHexString(),
                content: expect.any(String),
                dislikes: 0,
                likes: 0,
                parent: {
                    _id: parentComment.getStringId(),
                    contentType: 'comment'
                },
                replies: []
            }
        });
        await post.sync();
        await parentComment.sync();
        expect(parentComment.getReplies()).toStrictEqual<ObjectId[]>([
            expect.any(ObjectId)
        ]);
        done();
    });
});
