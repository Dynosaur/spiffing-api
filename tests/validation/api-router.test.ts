import { User } from 'app/server/interface/data-types';
import supertest from 'supertest';
import { Server } from 'server/server';
import { Express } from 'express';
import { ObjectId } from 'mongodb';
import { randomBytes } from 'crypto';
import { IDeregister, IRegister } from 'interface/responses/auth-endpoints';
import { ICreatePost, IGetPost, IGetPosts, IGetUser, IRatePost } from 'interface/responses/api-responses';
import { IMissingDataError, INoPostFoundError, INoUserFoundError, IObjectIdParseError, IUnauthenticatedError, IUnauthorizedError } from 'app/server/interface/responses/error-responses';

function expectUser(username: string): User {
    if (!username.length)
        username = expect.any(String);
    return {
        _id: expect.stringMatching(/[a-f\d]{24}/),
        created: expect.any(Number),
        screenname: username,
        username: username
    };
}

describe('api router validation', () => {
    let app: Express;
    let server: Server;
    let testUser = {
        username: 'hello2',
        password: 'world',
        id: ''
    };
    const postIds: string[] = [];

    beforeAll(async done => {
        process.env.environment = 'DEV';
        process.env.KEY = randomBytes(32).toString('hex');

        server = new Server(false);
        await server.initialize();
        app = server.app;

        await supertest(app)
        .post(`/api/user/${testUser.username}`)
        .auth(testUser.username, testUser.password)
        .then(response => {
            expect(response.body).toStrictEqual<IRegister.Success>({
                ok: true,
                user: expectUser(testUser.username)
            });
            testUser.id = response.body.user._id;
        }).catch(() => process.exit(1));

        done();
    });

    afterAll(async done => {
        await supertest(app)
        .delete(`/api/user/${testUser.id}`)
        .auth(testUser.username, testUser.password)
        .then(response => {
            expect(response.body).toStrictEqual<IDeregister.Success>({ ok: true });
        }).catch(() => process.exit(1));

        await server.mongo.client.close();
        done();
    });

    describe('get user', () => {
        it('should return the user\'s data', async done => {
            await supertest(app).get(`/api/user/${testUser.username}`).then(response => {
                expect(response.body).toStrictEqual<IGetUser.Success>({
                    ok: true,
                    user: {
                        _id: expect.stringMatching(/[a-f\d]{24}/),
                        created: expect.any(Number),
                        screenname: testUser.username,
                        username: testUser.username
                    }
                });
            });
            done();
        });
        it('should return an error if the user cannot be found', async done => {
            await supertest(app).get('/api/user/KingHarvest').then(response => {
                expect(response.body).toStrictEqual<INoUserFoundError>({
                    error: 'No User Found',
                    id: 'KingHarvest',
                    ok: false
                });
            });
            done();
        });
    });

    describe('create post', () => {
        it('should return an error if required body fields are not present', async done => {
            await supertest(app)
            .post('/api/post')
            .auth(testUser.username, testUser.password)
            .then(res => {
                expect(res.body).toStrictEqual<IMissingDataError>({
                    error: 'Missing Data',
                    ok: false,
                    missing: {
                        required: ['content', 'title'],
                        received: [],
                        'scope-name': 'body'
                    }
                });
            });
            await supertest(app)
            .post('/api/post')
            .auth(testUser.username, testUser.password)
            .send({ content: '' })
            .then(res => {
                expect(res.body).toStrictEqual<IMissingDataError>({
                    error: 'Missing Data',
                    ok: false,
                    missing: {
                        required: ['title'],
                        received: ['content'],
                        'scope-name': 'body'
                    }
                });
            });
            await supertest(app)
            .post('/api/post')
            .auth(testUser.username, testUser.password)
            .send({ title: '' })
            .then(res => {
                expect(res.body).toStrictEqual<IMissingDataError>({
                    error: 'Missing Data',
                    ok: false,
                    missing: {
                        received: ['title'],
                        required: ['content'],
                        'scope-name': 'body'
                    }
                });
            });

            done();
        });
        it('should require authorization', async done => {
            await supertest(app)
            .post('/api/post')
            .send({ author: '', content: '', title: '' })
            .then(res => {
                expect(res.body).toStrictEqual<IUnauthenticatedError>({
                    error: 'Unauthenticated',
                    ok: false
                });
            });
            await supertest(app)
            .post('/api/post')
            .auth(testUser.username, 'jambalaya')
            .send({ author: '', content: '', title: '' })
            .then(res => {
                expect(res.body).toStrictEqual<IUnauthorizedError>({
                    error: 'Unauthorized',
                    ok: false
                });
            });
            done();
        });
        it('should create a new post', async done => {
            const postContent = 'Hello, World!';
            const postTitle = 'Test Post';
            await supertest(app)
            .post('/api/post')
            .auth(testUser.username, testUser.password)
            .send({
                author: testUser.id,
                content: postContent,
                title: postTitle
            })
            .then(res => {
                expect(res.body).toStrictEqual<ICreatePost.Success>({
                    ok: true,
                    post: {
                        _id: expect.stringMatching(/[a-f\d]{24}/),
                        author: testUser.id,
                        comments: [],
                        content: postContent,
                        date: expect.any(Number),
                        dislikes: 0,
                        likes: 0,
                        title: postTitle
                    }
                });
                postIds.push(res.body.post._id);
            });

            done();
        });
    });

    describe('get post', () => {
        it('should get the post', async done => {
            await supertest(app).get(`/api/post/${postIds[0]}`).then(response => {
                expect(response.body).toStrictEqual<IGetPost.Success>({
                    ok: true,
                    post: {
                        _id: postIds[0],
                        author: testUser.id,
                        comments: [],
                        content: expect.any(String),
                        date: expect.any(Number),
                        dislikes: 0,
                        likes: 0,
                        title: expect.any(String)
                    }
                });
            });
            done();
        });
        it('should return an error if the post cannot be found', async done => {
            const id = randomBytes(12).toString('hex');
            await supertest(app).get(`/api/post/${id}`).then(response => {
                expect(response.body).toStrictEqual<INoPostFoundError>({
                    error: 'No Post Found',
                    id,
                    ok: false
                });
            });
            done();
        });
        it('should return an error if the id can not be parsed', async done => {
            const id = 'lolNotAValidID483947287';
            await supertest(app).get(`/api/post/${id}`).then(response => {
                expect(response.body).toStrictEqual<IObjectIdParseError>({
                    error: 'Object Id Parse',
                    provided: id,
                    ok: false
                });
            });
            done();
        });
    });

    describe('get posts', () => {
        it('should only allow certain query parameters', async done => {
            await supertest(app).get(`/api/posts?author=${randomBytes(12).toString('hex')}&random=5&tag=funny`).then(response => {
                expect(response.body).toStrictEqual<IGetPosts.Success>({
                    ok: true,
                    posts: [],
                    'query-allowed': ['author'],
                    'query-blocked': ['random', 'tag']
                });
            });
            done();
        });
    });

    describe('rate post', () => {
        it('should require authorization', async done => {
            await supertest(app)
            .post(`/api/rate/post/${postIds[0]}`)
            .send({ rating: 1 })
            .then(response => {
                expect(response.body).toStrictEqual<IUnauthenticatedError>({
                    error: 'Unauthenticated',
                    ok: false
                });
            });
            await supertest(app)
            .post(`/api/rate/post/${postIds[0]}`)
            .auth(testUser.username, 'Snail Jose')
            .send({ rating: 1 })
            .then(response => {
                expect(response.body).toStrictEqual<IUnauthorizedError>({
                    error: 'Unauthorized',
                    ok: false
                });
            });
            done();
        });
        it('should required a rating field in the request body', async done => {
            await supertest(app)
            .post(`/api/rate/post/${postIds[0]}`)
            .auth(testUser.username, testUser.password)
            .then(response => {
                expect(response.body).toStrictEqual<IMissingDataError>({
                    error: 'Missing Data',
                    missing: {
                        required: ['rating'],
                        received: [],
                        'scope-name': 'body'
                    },
                    ok: false
                });
            });
            done();
        });
        it('should rate', async done => {
            await supertest(app)
            .post(`/api/rate/post/${postIds[0]}`)
            .send({ rating: 1 })
            .auth(testUser.username, testUser.password)
            .then(response => {
                expect(response.body).toStrictEqual<IRatePost.Success>({ ok: true });
            });
            done();
        });
        it('should return an error with bad id', async done => {
            const id = randomBytes(12).toString('hex');
            await supertest(app)
            .post(`/api/rate/post/${id}`)
            .send({ rating: 1 })
            .auth(testUser.username, testUser.password)
            .then(response => {
                expect(response.body).toStrictEqual<INoPostFoundError>({
                    error: 'No Post Found',
                    id,
                    ok: false
                });
            });
            done();
        });
    });

});
