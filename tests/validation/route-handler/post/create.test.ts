import { Express } from 'express';
import { IAuthorizationParse } from 'interface/error/authorization-parse';
import { ICreatePost } from 'router/post/create';
import { IMissing } from 'interface/error/missing';
import { IUnauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized } from 'interface/error/unauthorized';
import { Server } from 'server/server';
import { UserWrapper } from 'database/user';
import supertest from 'supertest';

describe('createPost route handler validation', () => {
    let app: Express;
    let server: Server;
    let user: UserWrapper;
    const password = 'password';
    beforeEach(async done => {
        server = new Server(false);
        await server.initialize();
        app = server.app;
        user = await server.userApi.create(
            `user-${Math.round(Math.random() * 1000)}`,
            server.commonApi.securePassword(password)
        );
        done();
    });
    afterEach(async done => {
        await server.mongo.close();
        done();
    });
    it('should require authentication', async done => {
        await supertest(app)
        .post('/api/post')
        .then(response => {
            expect(response.body).toStrictEqual<IUnauthenticated>({
                error: 'Unauthenticated',
                ok: false
            });
        });
        done();
    });
    it('should require \'content\' and \'title\' in body', async done => {
        await supertest(app)
        .post('/api/post')
        .auth(user.username, password)
        .then(response => {
            expect(response.body).toStrictEqual<IMissing>({
                error: 'Missing Item',
                field: 'body',
                name: 'content',
                ok: false
            });
        });
        await supertest(app)
        .post('/api/post')
        .auth(user.username, password)
        .send({ content: 'Content' })
        .then(response => {
            expect(response.body).toStrictEqual<IMissing>({
                error: 'Missing Item',
                field: 'body',
                name: 'title',
                ok: false
            });
        });
        await supertest(app)
        .post('/api/post')
        .auth(user.username, password)
        .send({ title: 'Title' })
        .then(response => {
            expect(response.body).toStrictEqual<IMissing>({
                error: 'Missing Item',
                field: 'body',
                name: 'content',
                ok: false
            });
        });
        done();
    });
    it('should respond with error if authorization header is malformed', async done => {
        await supertest(app)
        .post('/api/post')
        .auth('', { type: 'bearer' })
        .send({ content: 'Content', title: 'Title' })
        .then(response => {
            expect(response.body).toStrictEqual<IAuthorizationParse>({
                error: 'Authorization Header Parse',
                ok: false,
                part: 'Authorization Type'
            });
        });
        done();
    });
    it('should require authorization', async done => {
        await supertest(app)
        .post('/api/post')
        .auth(user.username, '!password')
        .send({ content: 'Content', title: 'Title' })
        .then(response => {
            expect(response.body).toStrictEqual<IUnauthorized>({
                error: 'Unauthorized',
                ok: false
            });
        });
        done();
    });
    it('should create post', async done => {
        const postContent = 'Content';
        const postTitle = 'Title';
        await supertest(app)
        .post('/api/post')
        .auth(user.username, password)
        .send({ content: postContent, title: postTitle })
        .then(response => {
            expect(response.body).toStrictEqual<ICreatePost.Success>({
                ok: true,
                post: {
                    _id: expect.stringMatching(/^[a-f\d]{24}$/),
                    author: user.id,
                    comments: [],
                    content: postContent,
                    date: expect.any(Number),
                    dislikes: 0,
                    likes: 0,
                    title: postTitle
                }
            });
        });
        done();
    });
});
