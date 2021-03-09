import { ObjectId } from 'mongodb';
import { UserWrapper }            from 'database/user';
import { IDeleteUser }            from 'interface/responses/auth-endpoints';
import { deleteUser }             from 'router/delete-user';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { encodeBasicAuth }        from 'tools/auth';
import {
    IUnauthenticatedError,
    IUnauthorizedError
} from 'interface/responses/error-responses';

describe('delete-user route handler integration', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    beforeEach(async done => {
        env = new IntegrationEnvironment('delete-user');
        await env.initialize();
        user = await env.generateUser();
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    it('should require authentication', async done => {
        const response = await env.executeRouteHandler(deleteUser);
        expect(response.payload).toStrictEqual<IUnauthenticatedError>({
            ok: false,
            error: 'Unauthenticated'
        });
        done();
    });
    it('should require authorization', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, '!password');
        const response = await env.executeRouteHandler(deleteUser);
        expect(response.payload).toStrictEqual<IUnauthorizedError>({
            ok: false,
            error: 'Unauthorized'
        });
        done();
    });
    it('should delete a user', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        const response = await env.executeRouteHandler(deleteUser);
        expect(response.payload).toStrictEqual<IDeleteUser.Success>({ ok: true });
        expect(await env.db.collection.users.findOne({ _id: user._id })).toBeNull();
        done();
    });
    it('should remove the user\'s ratings from posts', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        const posts = await env.generatePosts(2, new ObjectId());
        const rateApi = await env.actions.user.getUserRateApi(user._id);
        await rateApi.likePost(posts[0]._id);
        await rateApi.dislikePost(posts[1]._id);
        await env.executeRouteHandler(deleteUser);
        expect(await env.db.collection.rates.findOne({ owner: user._id })).toBeNull();
        expect(await env.db.collection.posts.findOne({ _id: posts[0]._id })).toMatchObject({
            likes: 0,
            dislikes: 0
        });
        expect(await env.db.collection.posts.findOne({ _id: posts[1]._id })).toMatchObject({
            likes: 0,
            dislikes: 0
        });
        done();
    });
    it('should remove the user\'s posts', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        const posts = await env.generatePosts(2, new ObjectId());
        const rateApi = await env.actions.user.getUserRateApi(user._id);
        await rateApi.likePost(posts[0]._id);
        await rateApi.dislikePost(posts[1]._id);
        await env.executeRouteHandler(deleteUser);
        expect(await env.db.collection.rates.findOne({ owner: user._id })).toBeNull();
        expect(await env.db.collection.posts.findOne({ _id: posts[0]._id })).toMatchObject({
            likes: 0,
            dislikes: 0
        });
        expect(await env.db.collection.posts.findOne({ _id: posts[1]._id })).toMatchObject({
            likes: 0,
            dislikes: 0
        });
        done();
    });
});
