import { ObjectId } from 'mongodb';
import { PostWrapper }                   from 'database/post';
import { UserWrapper }                   from 'database/user';
import { IUnauthorized }                 from 'interface/error/unauthorized';
import { IUnauthenticated }              from 'interface/error/unauthenticated';
import { IMissing }                      from 'interface/error/missing';
import { IContentNotFound }              from 'interface/error/content-not-found';
import { ICreateComment, createComment } from 'router/comment/create';
import { IntegrationEnvironment }        from 'tests/mock/integration-environment';
import { encodeBasicAuth }               from 'tools/auth';

describe('create-comment route handler', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    beforeEach(async done => {
        env = new IntegrationEnvironment('create-comment');
        await env.initialize();
        user = await env.generateUser();
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    it('should require authentication', async done => {
        let response = await env.executeRouteHandler(createComment);
        expect(response.payload).toStrictEqual<IUnauthenticated>({
            ok: false,
            error: 'Unauthenticated'
        });
        env.request.headers.authorization = encodeBasicAuth(user.username, '!password');
        env.request.body.content = '';
        response = await env.executeRouteHandler(createComment);
        expect(response.payload).toStrictEqual<IUnauthorized>({
            ok: false,
            error: 'Unauthorized'
        });
        done();
    });
    it('should require content in request body', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
        const response = await env.executeRouteHandler(createComment);
        expect(response.payload).toStrictEqual<IMissing>({
            ok: false,
            error: 'Missing Item',
            field: 'body',
            name: 'content'
        });
        done();
    });
    it('should check that the parent exists', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
        env.request.params.id = new ObjectId().toHexString();
        env.request.params.contentType = 'post';
        env.request.body.content = 'Content';
        let response = await env.executeRouteHandler(createComment);
        expect(response.payload).toStrictEqual<IContentNotFound>({
            content: 'Post',
            error: 'Content Not Found',
            id: expect.any(String),
            ok: false,
        });
        env.request.params.contentType = 'comment';
        response = await env.executeRouteHandler(createComment);
        expect(response.payload).toStrictEqual<IContentNotFound>({
            content: 'Comment',
            ok: false,
            error: 'Content Not Found',
            id: expect.any(String)
        });
        done();
    });
    describe('requires post', () => {
        let post: PostWrapper;
        beforeEach(async done => {
            post = await env.generatePost(user._id);
            done();
        });
        it('should create a comment on a post', async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, 'password');
            env.request.params.contentType = 'post';
            env.request.params.id = post.id;
            env.request.body.content = 'Comment Content';
            const response = await env.executeRouteHandler(createComment);
            expect(response.payload).toStrictEqual<ICreateComment.Success>({
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
            const response = await env.executeRouteHandler(createComment);
            expect(response.payload).toStrictEqual<ICreateComment.Success>({
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
});
