import { randomBytes } from 'crypto';
import { Express }     from 'express';
import supertest       from 'supertest';
import { UserWrapper } from 'database/user';
import { PostWrapper } from 'database/post';
import { IRatePost }   from 'interface/responses/api-responses';
import { Server }      from 'server/server';
import {
    INoPostFoundError,
    IObjectIdParseError,
    IUnauthenticatedError,
    IUnauthorizedError
} from 'interface/responses/error-responses';

describe('createPost route handler validation', () => {
    let app: Express;
    let server: Server;
    let user: UserWrapper;
    let secondUser: UserWrapper;
    let posts: PostWrapper[];
    const password = 'password';
    beforeEach(async done => {
        server = new Server(false);
        await server.initialize();
        app = server.app;
        user = await server.userApi.create(
            `user-${Math.round(Math.random() * 100000)}`,
            server.commonApi.securePassword(password)
        );
        secondUser = await server.userApi.create(
            `user-${Math.round(Math.random() * 100000)}`,
            server.commonApi.securePassword(password)
        );
        posts = [
            await server.postApi.create(user._id, randomBytes(64).toString('hex'), 'Content'),
            await server.postApi.create(user._id, randomBytes(64).toString('hex'), 'Content'),
            await server.postApi.create(user._id, randomBytes(64).toString('hex'), 'Content'),
            await server.postApi.create(secondUser._id, randomBytes(64).toString('hex'), 'Content'),
            await server.postApi.create(secondUser._id, randomBytes(64).toString('hex'), 'Content')
        ];
        done();
    });
    afterEach(async done => {
        await server.mongo.close();
        done();
    });
    it('should require authentication', async done => {
        await supertest(app)
        .post(`/api/rate/post/${posts[0].id}`)
        .then(response => {
            expect(response.body).toStrictEqual<IUnauthenticatedError>({
                error: 'Unauthenticated',
                ok: false
            });
        });
        done();
    });
    it('should require authorization', async done => {
        await supertest(app)
        .post(`/api/rate/post/${posts[0].id}`)
        .auth(user.username, '!password')
        .send({ rating: 1 })
        .then(response => {
            expect(response.body).toStrictEqual<IUnauthorizedError>({
                error: 'Unauthorized',
                ok: false
            });
        });
        done();
    });
    it('should require postId to be an ObjectId', async done => {
        await supertest(app)
        .post('/api/rate/post/objectId')
        .auth(user.username, password)
        .send({ rating: 1 })
        .then(response => {
            expect(response.body).toStrictEqual<IObjectIdParseError>({
                error: 'Object Id Parse',
                ok: false,
                provided: 'objectId'
            });
        });
        done();
    });
    it('should require post to exist', async done => {
        await supertest(app)
        .post(`/api/rate/post/${randomBytes(12).toString('hex')}`)
        .auth(user.username, password)
        .send({ rating: 1 })
        .then(response => {
            expect(response.body).toStrictEqual<INoPostFoundError>({
                error: 'No Post Found',
                ok: false,
                id: expect.stringMatching(/^[a-f\d]{24}$/)
            });
        });
        done();
    });
    it('should like an unrated post', async done => {
        const targetPost = posts[0];
        const response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.likes).toBe(1);
            else expect(post.likes).toBe(0);
            expect(post.dislikes).toBe(0);
        }
        const userRatedPosts = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRatedPosts.posts).toStrictEqual({
            liked: [targetPost._id],
            disliked: []
        });
        const secondUserRatedPosts = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        done();
    });
    it('should like an already liked post', async done => {
        const targetPost = posts[2];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.likes).toBe(1);
            else expect(post.likes).toBe(0);
            expect(post.dislikes).toBe(0);
        }
        const userRatedPosts = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRatedPosts.posts).toStrictEqual({
            liked: [targetPost._id],
            disliked: []
        });
        const secondUserRatedPosts = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        done();
    });
    it('should like a disliked post', async done => {
        const targetPost = posts[3];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.likes).toBe(1);
            else expect(post.likes).toBe(0);
            expect(post.dislikes).toBe(0);
        }
        const userRatedPosts = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRatedPosts.posts).toStrictEqual({
            liked: [targetPost._id],
            disliked: []
        });
        const secondUserRatedPosts = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        done();
    });
    it('should dislike an unrated post', async done => {
        const targetPost = posts[1];
        const response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.dislikes).toBe(1);
            else expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRatedPosts = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: [targetPost._id]
        });
        const secondUserRatedPosts = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        done();
    });
    it('should dislike an already disliked post', async done => {
        const targetPost = posts[3];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.dislikes).toBe(1);
            else expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRatedPosts = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: [targetPost._id]
        });
        const secondUserRatedPosts = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        done();
    });
    it('should dislike a liked post', async done => {
        const targetPost = posts[2];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.dislikes).toBe(1);
            else expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRatedPosts = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: [targetPost._id]
        });
        const secondUserRatedPosts = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        done();
    });
    it('should unrate an already unrated post', async done => {
        const targetPost = posts[1];
        const response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 0 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRatedPosts = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        const secondUserRatedPosts = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        done();
    });
    it('should unrate a liked post', async done => {
        const targetPost = posts[2];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 0 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRatedPosts = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        const secondUserRatedPosts = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        done();
    });
    it('should unrate a disliked post', async done => {
        const targetPost = posts[4];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 0 });
        expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRatedPosts = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        const secondUserRatedPosts = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRatedPosts.posts).toStrictEqual({
            liked: [],
            disliked: []
        });
        done();
    });
});
