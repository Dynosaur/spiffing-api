import { IDeletePost, deletePost } from 'router/post/delete';
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

describe('delete-post route handler integration', () => {
    let env: IntegrationEnvironment;
    let author: UserWrapper;
    let post: PostWrapper;
    beforeEach(async done => {
        env = new IntegrationEnvironment('delete-post');
        await env.initialize();
        author = await env.generateUser();
        post = await env.generatePost(author._id);
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    it('should require authentication', async done => {
        const response = await env.executeRouteHandler(deletePost);
        expect(response.payload).toStrictEqual<IUnauthenticated>({
            error: 'Unauthenticated',
            ok: false
        });
        done();
    });
    it('should require id param', async done => {
        env.request.headers.authorization = 'fake-authorization';
        const response = await env.executeRouteHandler(deletePost);
        expect(response.payload).toStrictEqual<IMissing>({
            error: 'Missing Item',
            field: 'param',
            name: 'id',
            ok: false
        });
        done();
    });
    it('should require authorization', async done => {
        env.request.headers.authorization = encodeBasicAuth(author.username, '!password');
        env.request.params.id = 'fake-id';
        const response = await env.executeRouteHandler(deletePost);
        expect(response.payload).toStrictEqual<IUnauthorized>({
            error: 'Unauthorized',
            ok: false
        });
        done();
    });
    it('should require id param to be an ObjectId', async done => {
        env.request.headers.authorization = encodeBasicAuth(author.username, env.defaultPassword);
        env.request.params.id = 'fake-id';
        const response = await env.executeRouteHandler(deletePost);
        expect(response.payload).toStrictEqual<IObjectIdParse>({
            context: 'params.id',
            error: 'Object Id Parse',
            ok: false,
            provided: 'fake-id'
        });
        done();
    });
    it('should require post to exist', async done => {
        env.request.headers.authorization = encodeBasicAuth(author.username, env.defaultPassword);
        const stringId = new ObjectId().toHexString();
        env.request.params.id = stringId;
        const response = await env.executeRouteHandler(deletePost);
        expect(response.payload).toStrictEqual<IContentNotFound>({
            content: 'Post',
            error: 'Content Not Found',
            id: stringId,
            ok: false
        });
        done();
    });
    it('should require authorization from post author', async done => {
        const other = await env.generateUser();
        env.request.headers.authorization = encodeBasicAuth(other.username, env.defaultPassword);
        env.request.params.id = post.id;
        const response = await env.executeRouteHandler(deletePost);
        expect(response.payload).toStrictEqual<IUnauthorized>({
            error: 'Unauthorized',
            ok: false
        });
        done();
    });
    it('should return ok', async done => {
        env.request.headers.authorization = encodeBasicAuth(author.username, env.defaultPassword);
        env.request.params.id = post.id;
        const response = await env.executeRouteHandler(deletePost);
        expect(response.payload).toStrictEqual<IDeletePost.Success>({ ok: true });
        done();
    });
});
