import { Express } from 'express';
import { IContentNotFound } from 'interface/error/content-not-found';
import { IObjectIdParse } from 'interface/error/object-id-parse';
import { IRatePost } from 'router/rate/post';
import { IUnauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized } from 'interface/error/unauthorized';
import { PostWrapper } from 'database/post';
import { Server } from 'server/server';
import { UserWrapper } from 'database/user';
import { randomBytes } from 'crypto';
import supertest from 'supertest';

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
            expect(response.body).toStrictEqual<IUnauthenticated>({
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
            expect(response.body).toStrictEqual<IUnauthorized>({
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
            expect(response.body).toStrictEqual<IObjectIdParse>({
                context: 'params.id',
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
            expect(response.body).toStrictEqual<IContentNotFound>({
                content: 'Post',
                error: 'Content Not Found',
                id: expect.stringMatching(/^[a-f\d]{24}$/),
                ok: false
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
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.likes).toBe(1);
            else expect(post.likes).toBe(0);
            expect(post.dislikes).toBe(0);
        }
        const userRates = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRates.posts).toStrictEqual({
            disliked: [],
            liked: [targetPost._id]
        });
        const secondUserRates = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        done();
    });
    it('should like an already liked post', async done => {
        const targetPost = posts[2];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: false,
            ok: true
        });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.likes).toBe(1);
            else expect(post.likes).toBe(0);
            expect(post.dislikes).toBe(0);
        }
        const userRates = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRates.posts).toStrictEqual({
            disliked: [],
            liked: [targetPost._id]
        });
        const secondUserRates = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        done();
    });
    it('should like a disliked post', async done => {
        const targetPost = posts[3];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.likes).toBe(1);
            else expect(post.likes).toBe(0);
            expect(post.dislikes).toBe(0);
        }
        const userRates = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRates.posts).toStrictEqual({
            disliked: [],
            liked: [targetPost._id]
        });
        const secondUserRates = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        done();
    });
    it('should dislike an unrated post', async done => {
        const targetPost = posts[1];
        const response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.dislikes).toBe(1);
            else expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRates = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRates.posts).toStrictEqual({
            disliked: [targetPost._id],
            liked: []
        });
        const secondUserRates = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        done();
    });
    it('should dislike an already disliked post', async done => {
        const targetPost = posts[3];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: false,
            ok: true
        });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.dislikes).toBe(1);
            else expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRates = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRates.posts).toStrictEqual({
            disliked: [targetPost._id],
            liked: []
        });
        const secondUserRates = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        done();
    });
    it('should dislike a liked post', async done => {
        const targetPost = posts[2];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            if (post.id === targetPost.id) expect(post.dislikes).toBe(1);
            else expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRates = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRates.posts).toStrictEqual({
            disliked: [targetPost._id],
            liked: []
        });
        const secondUserRates = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        done();
    });
    it('should unrate an already unrated post', async done => {
        const targetPost = posts[1];
        const response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 0 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: false,
            ok: true
        });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRates = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        const secondUserRates = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        done();
    });
    it('should unrate a liked post', async done => {
        const targetPost = posts[2];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 0 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRates = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        const secondUserRates = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        done();
    });
    it('should unrate a disliked post', async done => {
        const targetPost = posts[4];
        let response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        response = await supertest(app)
            .post(`/api/rate/post/${targetPost.id}`)
            .auth(user.username, password)
            .send({ rating: 0 });
        expect(response.body).toStrictEqual<IRatePost.Success>({
            changed: true,
            ok: true
        });
        const updatedPosts = await server.postApi.getManyByQuery({});
        for (const post of updatedPosts) {
            expect(post.dislikes).toBe(0);
            expect(post.likes).toBe(0);
        }
        const userRates = (await server.userApi.getUserRateApi(user._id)).getRates();
        expect(userRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        const secondUserRates = (await server.userApi.getUserRateApi(secondUser._id)).getRates();
        expect(secondUserRates.posts).toStrictEqual({
            disliked: [],
            liked: []
        });
        done();
    });
});
