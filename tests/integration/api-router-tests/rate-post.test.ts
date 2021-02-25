import { ObjectId } from 'mongodb';
import { ratePost } from 'router/api-router';
import { BoundUser } from 'database/dbi/user-api';
import { BoundPost } from 'database/dbi/post-actions';
import { IRatePost } from 'interface/responses/api-responses';
import { encodeBasicAuth } from 'tools/auth';
import { DbPost, DbRatedPosts } from 'database/data-types';
import { IntegrationEnvironment } from 'tests/mock/integration/integration-environment';
import { IMissingDataError, IUnauthenticatedError, IUnauthorizedError } from 'interface/responses/error-responses';

describe('ratePost route handler', () => {
    let env: IntegrationEnvironment;
    let user: BoundUser;
    let posts: BoundPost[];
    beforeEach(async done => {
        env = new IntegrationEnvironment('RatePost');
        await env.initialize();
        user = await env.generateUser();
        posts = await env.generatePosts(1, user._id);
        done();
    });
    afterEach(async done => {
        await env.closeConnections();
        done();
    });
    describe('authorization', () => {
        it('should require authentication', async done => {
            const response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IUnauthenticatedError>({
                error: 'Unauthenticated',
                ok: false
            });
            done();
        });
        it('should require authorization', async done => {
            env.request.headers.authorization = encodeBasicAuth(user.username, 'notYourPassword');
            env.request.body.rating = 0;
            const response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IUnauthorizedError>({
                error: 'Unauthorized',
                ok: false
            });
            done();
        });
    });
    it('should require body prop \'rating\'', async done => {
        env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
        const response = await env.executeRouteHandler(ratePost);
        expect(response.payload).toStrictEqual<IMissingDataError>({
            error: 'Missing Data',
            missing: {
                received: [],
                required: ['rating'],
                'scope-name': 'body'
            },
            ok: false
        });
        done();
    });
    describe('likes', () => {
        let post: BoundPost;
        beforeEach(() => {
            post = posts[0];
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            env.request.body.rating = 1;
            env.request.params.id = post.getIdString();
        });
        it('should like', async done => {
            const response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            expect(await env.posts.db.findOne({ _id: post.getObjectId() })).toStrictEqual<DbPost>({
                _id: post.getObjectId(),
                author: user._id,
                comments: [],
                content: expect.any(String),
                dislikes: 0,
                likes: 1,
                title: expect.any(String)
            });
            expect(await env.ratings.db.findOne({ owner: user._id })).toStrictEqual<DbRatedPosts>({
                _id: expect.any(ObjectId),
                owner: user._id,
                posts: [{
                    _id: post.getObjectId(),
                    rating: 1
                }]
            });
            done();
        });
        it('should not affect a previously liked post', async done => {
            let response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            expect(await env.posts.db.findOne({ _id: post.getObjectId() })).toStrictEqual<DbPost>({
                _id: post.getObjectId(),
                author: user._id,
                comments: [],
                content: expect.any(String),
                dislikes: 0,
                likes: 1,
                title: expect.any(String)
            });
            expect(await env.ratings.db.findOne({ owner: user._id })).toStrictEqual<DbRatedPosts>({
                _id: expect.any(ObjectId),
                owner: user._id,
                posts: [{
                    _id: post.getObjectId(),
                    rating: 1
                }]
            });
            done();
        });
        it('should undo a dislike', async done => {
            env.request.body.rating = -1;
            let response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            env.request.body.rating = 1;
            response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            expect(await env.posts.db.findOne({ _id: post.getObjectId() })).toStrictEqual<DbPost>({
                _id: post.getObjectId(),
                author: user._id,
                comments: [],
                content: expect.any(String),
                dislikes: 0,
                likes: 1,
                title: expect.any(String)
            });
            expect(await env.ratings.db.findOne({ owner: user._id })).toStrictEqual<DbRatedPosts>({
                _id: expect.any(ObjectId),
                owner: user._id,
                posts: [{
                    _id: post.getObjectId(),
                    rating: 1
                }]
            });
            done();
        });
    });
    describe('dislikes', () => {
        let post: BoundPost;
        beforeEach(() => {
            post = posts[0];
            env.request.headers.authorization = encodeBasicAuth(user.username, env.defaultPassword);
            env.request.body.rating = -1;
            env.request.params.id = post.getIdString();
        });
        it('should dislike', async done => {
            const response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            expect(await env.posts.db.findOne({ _id: post.getObjectId() })).toStrictEqual<DbPost>({
                _id: post.getObjectId(),
                author: user._id,
                comments: [],
                content: expect.any(String),
                dislikes: 1,
                likes: 0,
                title: expect.any(String)
            });
            expect(await env.ratings.db.findOne({ owner: user._id })).toStrictEqual<DbRatedPosts>({
                _id: expect.any(ObjectId),
                owner: user._id,
                posts: [{
                    _id: post.getObjectId(),
                    rating: -1
                }]
            });
            done();
        });
        it('should not affect a previously disliked post', async done => {
            let response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            expect(await env.posts.db.findOne({ _id: post.getObjectId() })).toStrictEqual<DbPost>({
                _id: post.getObjectId(),
                author: user._id,
                comments: [],
                content: expect.any(String),
                dislikes: 1,
                likes: 0,
                title: expect.any(String)
            });
            expect(await env.ratings.db.findOne({ owner: user._id })).toStrictEqual<DbRatedPosts>({
                _id: expect.any(ObjectId),
                owner: user._id,
                posts: [{
                    _id: post.getObjectId(),
                    rating: -1
                }]
            });
            done();
        });
        it('should undo a like', async done => {
            env.request.body.rating = 1;
            let response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            env.request.body.rating = -1;
            response = await env.executeRouteHandler(ratePost);
            expect(response.payload).toStrictEqual<IRatePost.Success>({ ok: true });
            expect(await env.posts.db.findOne({ _id: post.getObjectId() })).toStrictEqual<DbPost>({
                _id: post.getObjectId(),
                author: user._id,
                comments: [],
                content: expect.any(String),
                dislikes: 1,
                likes: 0,
                title: expect.any(String)
            });
            expect(await env.ratings.db.findOne({ owner: user._id })).toStrictEqual<DbRatedPosts>({
                _id: expect.any(ObjectId),
                owner: user._id,
                posts: [{
                    _id: post.getObjectId(),
                    rating: -1
                }]
            });
            done();
        });
    });
});
