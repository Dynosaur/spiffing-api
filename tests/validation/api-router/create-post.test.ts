import supertest from 'supertest';
import { Server } from 'server/server';
import { Express } from 'express';
import { randomBytes } from 'crypto';
import { UserWrapper } from 'database/user';
import { ICreatePost } from 'interface/responses/api-responses';
import {
    IMissingDataError,
    IUnauthorizedError,
    IUnauthenticatedError,
    IAuthorizationParseError
} from 'interface/responses/error-responses';

describe('createPost route handler validation', () => {
    let app: Express;
    let server: Server;
    let user: UserWrapper;
    const password = 'password';
    beforeEach(async done => {
        process.env.environment = 'TEST';
        process.env.KEY = randomBytes(32).toString('hex');
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
            expect(response.body).toStrictEqual<IUnauthenticatedError>({
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
            expect(response.body).toStrictEqual<IMissingDataError>({
                error: 'Missing Data',
                missing: {
                    'scope-name': 'body',
                    received: [],
                    required: expect.arrayContaining(['content', 'title'])
                },
                ok: false
            });
        });
        await supertest(app)
        .post('/api/post')
        .auth(user.username, password)
        .send({ content: 'Content' })
        .then(response => {
            expect(response.body).toStrictEqual<IMissingDataError>({
                error: 'Missing Data',
                missing: {
                    'scope-name': 'body',
                    received: ['content'],
                    required: expect.arrayContaining(['title'])
                },
                ok: false
            });
        });
        await supertest(app)
        .post('/api/post')
        .auth(user.username, password)
        .send({ title: 'Title' })
        .then(response => {
            expect(response.body).toStrictEqual<IMissingDataError>({
                error: 'Missing Data',
                missing: {
                    'scope-name': 'body',
                    received: ['title'],
                    required: expect.arrayContaining(['content'])
                },
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
            expect(response.body).toStrictEqual<IAuthorizationParseError>({
                error: 'Authorization Parsing Error',
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
            expect(response.body).toStrictEqual<IUnauthorizedError>({
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
