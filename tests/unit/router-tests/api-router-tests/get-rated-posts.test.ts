import { BoundUser } from 'database/dbi/user-api';
import { BoundPost } from 'database/dbi/post-actions';
import { getRatedPosts } from 'server/router/api-router';
import { IGetRatedPosts } from 'interface/responses/api-responses';
import { encodeBasicAuth } from 'tools/auth';
import { MockEnvironment } from 'tests/mock';
import { IAuthHeaderIdParamMismatchError, IUnauthenticatedError, IUnauthorizedError } from 'interface/responses/error-responses';

describe('getRatedPosts route handler', () => {
    let mock: MockEnvironment<unknown>;
    let posts: BoundPost[];
    let user: BoundUser;
    beforeEach(async done => {
        mock = new MockEnvironment();
        mock.generatePosts(5);
        posts = await mock.actions.post.readPosts({});
        user = await mock.actions.user.readUser({ _id: mock.createUser()._id });
        mock.request.headers.authorization = encodeBasicAuth(user.username, MockEnvironment.defaultPassword);
        mock.request.params.ownerId = user._id.toHexString();
        done();
    });
    it('should require authorization', async done => {
        delete mock.request.headers.authorization;
        let response = await mock.runRouteHandler(getRatedPosts);
        expect(response.payload).toStrictEqual<IUnauthenticatedError>({
            error: 'Unauthenticated',
            ok: false
        });
        mock.request.headers.authorization = encodeBasicAuth(user.username, 'night');
        response = await mock.runRouteHandler(getRatedPosts);
        expect(response.payload).toStrictEqual<IUnauthorizedError>({
            error: 'Unauthorized',
            ok: false
        });
        done();
    });
    it('should require the ownerId to match the authorized user', async done => {
        mock.request.params.ownerId = 'hello';
        const response = await mock.runRouteHandler(getRatedPosts);
        expect(response.payload).toStrictEqual<IAuthHeaderIdParamMismatchError>({
            error: 'Authorization Header and Id Param Mismatch',
            headerId: user._id.toHexString(),
            ok: false,
            paramId: 'hello'
        });
        done();
    });
    it('should return the user\'s rated posts', async done => {
        let response = await mock.runRouteHandler(getRatedPosts);
        expect(response.payload).toStrictEqual<IGetRatedPosts.Success>({
            ok: true,
            ratedPosts: {
                _id: expect.stringMatching(/[a-f\d]{24}/),
                owner: user.id,
                posts: []
            }
        });
        await user.rate.likePost(posts[0]);
        await user.rate.likePost(posts[1]);
        await user.rate.dislikePost(posts[2]);
        response = await mock.runRouteHandler(getRatedPosts);
        expect(response.payload).toStrictEqual<IGetRatedPosts.Success>({
            ok: true,
            ratedPosts: {
                _id: expect.stringMatching(/[a-f\d]{24}/),
                owner: user.id,
                posts: [{ _id: posts[0].id, rating: 1 },
                        { _id: posts[1].id, rating: 1 },
                        { _id: posts[2].id, rating: -1 }]
            }
        });
        done();
    });
});
