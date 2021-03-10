import { ObjectId } from 'mongodb';
import { PostWrapper }            from 'database/post';
import { UserWrapper }            from 'database/user';
import { IPostComment }           from 'interface/responses/api-responses';
import { postComment }            from 'router/api-router';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { encodeBasicAuth }        from 'tools/auth';
import {
    IMissingDataError,
    INoPostFoundError,
    IUnauthorizedError,
    INoCommentFoundError,
    IUnauthenticatedError
} from 'interface/responses/error-responses';

describe('post-comment route handler', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    let post: PostWrapper;
    beforeEach(async done => {
        env = new IntegrationEnvironment('post-comment');
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
        const response = await env.executeRouteHandler(postComment);
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
        env.request.params.id = post.id;
        env.request.body.content = 'Comment Content';
        const response = await env.executeRouteHandler(postComment);
        expect(response.payload).toStrictEqual<IPostComment.Success>({
            ok: true,
            comment: {
                _id: expect.stringMatching(/^[a-f\d]{24}$/),
                author: user.id,
                content: expect.any(String),
                created: expect.any(Number),
                dislikes: 0,
                likes: 0,
                parent: {
                    _id: post.id,
                    contentType: 'post'
                },
                replies: []
            }
        });
        done();
    });
    it('should create a comment on a comment', async done => {
        const parentComment = await env.api.comment.create(user._id, 'Content', 'post', post._id);
        env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
        env.request.params.contentType = 'comment';
        env.request.params.id = parentComment._id.toHexString();
        env.request.body.content = 'Comment Content';
        const response = await env.executeRouteHandler(postComment);
        expect(response.payload).toStrictEqual<IPostComment.Success>({
            ok: true,
            comment: {
                _id: expect.stringMatching(/^[a-f\d]{24}$/),
                author: user.id,
                content: expect.any(String),
                created: expect.any(Number),
                dislikes: 0,
                likes: 0,
                parent: {
                    _id: parentComment._id.toHexString(),
                    contentType: 'comment'
                },
                replies: []
            }
        });
        done();
    });
});
