import { User } from 'app/server/interface/data-types';
import supertest from 'supertest';
import { Server } from 'server/server';
import { Express } from 'express';
import { ObjectId } from 'mongodb';
import { Automated } from 'interface/responses/error-responses';
import { randomBytes } from 'crypto';
import { Deregister, Register } from 'interface/responses/auth-endpoints';
import { CreatePost, GetPost, GetPosts, GetUser, RatePost } from 'interface/responses/api-responses';

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
        username: 'hello',
        password: 'world',
        id: null
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
            expect(response.body).toStrictEqual<Register.Ok.Created>({
                ok: true,
                user: expectUser(testUser.username)
            });
            testUser.id = new ObjectId(response.body.user?._id);
        }).catch(() => process.exit(1));

        done();
    });

    afterAll(async done => {
        await supertest(app)
        .delete(`/api/user/${testUser.username}`)
        .auth(testUser.username, testUser.password)
        .then(response => {
            expect(response.body).toStrictEqual<Deregister.Ok>({ ok: true });
        }).catch(() => process.exit(1));

        await server.mongo.client.close();
        done();
    });

    describe('get user', () => {
        it('should return the user\'s data', async done => {
            await supertest(app).get(`/api/user/${testUser.username}`).then(response => {
                expect(response.body).toStrictEqual<GetUser.Ok.UserFound>({
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
            await supertest(app).get('/api/user/King Harvest').then(response => {
                expect(response.body).toStrictEqual<GetUser.Failed.UserNotFound>({
                    error: 'User Not Found',
                    ok: false
                });
            });
            done();
        });
    });

    describe('create post', () => {
        it('should return a parsing error if body author is extraneous', async done => {
            await supertest(app)
            .post(`/api/${testUser.username}/post`)
            .auth(testUser.username, testUser.password)
            .send({
                author: '',
                content: 'content',
                title: 'title'
            })
            .then(res => {
                expect(res.body).toStrictEqual<CreatePost.Failed.Parse>({
                    error: 'Parsing Error',
                    ok: false,
                    path: {
                        body: {
                            author: ''
                        }
                    }
                });
            });

            done();
        });
        it('should return an error if required body fields are not present', async done => {
            await supertest(app)
            .post(`/api/${testUser.username}/post`)
            .auth(testUser.username, testUser.password)
            .then(res => {
                expect(res.body).toStrictEqual<Automated.Failed.MissingData>({
                    error: 'Missing Requirements',
                    ok: false,
                    missing: {
                        possible: [['author', 'content', 'title']],
                        provided: [],
                        scope: 'body'
                    }
                });
            });
            await supertest(app)
            .post(`/api/${testUser.username}/post`)
            .auth(testUser.username, testUser.password)
            .send({ author: '' })
            .then(res => {
                expect(res.body).toStrictEqual<Automated.Failed.MissingData>({
                    error: 'Missing Requirements',
                    ok: false,
                    missing: {
                        possible: [['author', 'content', 'title']],
                        provided: ['author'],
                        scope: 'body'
                    }
                });
            });
            await supertest(app)
            .post(`/api/${testUser.username}/post`)
            .auth(testUser.username, testUser.password)
            .send({ author: '', content: '' })
            .then(res => {
                expect(res.body).toStrictEqual<Automated.Failed.MissingData>({
                    error: 'Missing Requirements',
                    ok: false,
                    missing: {
                        possible: [['author', 'content', 'title']],
                        provided: ['author', 'content'],
                        scope: 'body'
                    }
                });
            });

            done();
        });
        it('should require an authorization header', async done => {
            await supertest(app)
            .post(`/api/${testUser.username}/post`)
            .send({ author: '', content: '', title: '' })
            .then(res => {
                expect(res.body).toStrictEqual<Automated.Failed.MissingData>({
                    error: 'Missing Requirements',
                    missing: {
                        possible: [['authorization']],
                        provided: expect.any(Array),
                        scope: 'headers'
                    },
                    ok: false
                });
            });

            done();
        });
        it('should require authorization', async done => {
            await supertest(app)
            .post(`/api/${testUser.username}/post`)
            .auth(testUser.username, 'worldcon')
            .send({ author: '', content: '', title: '' })
            .then(res => {
                expect(res.body).toStrictEqual<Automated.Failed.Unauthorized>({
                    error: 'Authorization Failed',
                    ok: false
                });
            });

            done();
        });
        it('should create a new post', async done => {
            const postContent = 'Hello, World!';
            const postTitle = 'Test Post';
            await supertest(app)
            .post(`/api/${testUser.username}/post`)
            .auth(testUser.username, testUser.password)
            .send({
                author: testUser.id.toHexString(),
                content: postContent,
                title: postTitle
            })
            .then(res => {
                expect(res.body).toStrictEqual<CreatePost.Ok.Created>({
                    ok: true,
                    post: {
                        _id: expect.stringMatching(/[a-f\d]{24}/),
                        author: testUser.id.toHexString(),
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
                expect(response.body).toStrictEqual<GetPost.Ok.FoundPost>({
                    ok: true,
                    post: {
                        _id: postIds[0],
                        author: testUser.id.toHexString(),
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
            await supertest(app).get(`/api/post/${randomBytes(12).toString('hex')}`).then(response => {
                expect(response.body).toStrictEqual<GetPost.Failed.NoPost>({
                    error: 'Post Not Found',
                    ok: false
                });
            });
            done();
        });
        it('should return an error if the id can not be parsed', async done => {
            await supertest(app).get('/api/post/lolNotAValidID483947287').then(response => {
                expect(response.body).toStrictEqual<GetPost.Failed.IDParse>({
                    error: 'Could Not Parse ID',
                    ok: false
                });
            });
            done();
        });
    });

    describe('get posts', () => {
        it('should only allow certain query parameters', async done => {
            await supertest(app).get(`/api/posts?author=${randomBytes(12).toString('hex')}&random=5&tag=funny`).then(response => {
                expect(response.body).toStrictEqual<GetPosts.PostsFound>({
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
        it('should required a rating field in the request body', async done => {
            await supertest(app).post(`/api/rate/post/${postIds[0]}`).then(response => {
                expect(response.body).toStrictEqual<Automated.Failed.MissingData>({
                    error: 'Missing Requirements',
                    missing: {
                        possible: [['rating']],
                        provided: [],
                        scope: 'body'
                    },
                    ok: false
                });
            });
            done();
        });
        it('should require authorization', async done => {
            await supertest(app).post(`/api/rate/post/${postIds[0]}`).send({ rating: 1 }).then(response => {
                expect(response.body).toStrictEqual<Automated.Failed.MissingData>({
                    error: 'Missing Requirements',
                    missing: {
                        possible: [['authorization']],
                        provided: expect.any(Array),
                        scope: 'headers'
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
                expect(response.body).toStrictEqual<RatePost.Ok>({ ok: true });
            });
            done();
        });
        it('should return an error with bad id', async done => {
            await supertest(app)
            .post(`/api/rate/post/${randomBytes(12).toString('hex')}`)
            .send({ rating: 1 })
            .auth(testUser.username, testUser.password)
            .then(response => {
                expect(response.body).toStrictEqual<RatePost.Failed.NoPost>({
                    error: 'No Post',
                    ok: false
                });
            });
            done();
        });
    });

});
