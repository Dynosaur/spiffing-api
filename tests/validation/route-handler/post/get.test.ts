import { generatePosts, generateUser } from 'tests/validation/tools/generate';
import { Express } from 'express';
import { IGetPost } from 'router/post/get';
import { IObjectIdParse } from 'interface/error/object-id-parse';
import { PostWrapper } from 'database/post';
import { Server } from 'server/server';
import { UserWrapper } from 'database/user';
import supertest from 'supertest';

describe('createPost route handler validation', () => {
    let app: Express;
    let server: Server;
    let user: UserWrapper;
    let secondUser: UserWrapper;
    let posts: PostWrapper[];
    beforeEach(async done => {
        server = new Server();
        await server.initialize();
        app = server.app;
        user = await generateUser(server.userApi, server.commonApi);
        secondUser = await generateUser(server.userApi, server.commonApi);
        posts = (await generatePosts(server.postApi, user._id, 3)).concat(
            await generatePosts(server.postApi, secondUser._id, 2)
        );
        done();
    });
    afterEach(async done => {
        await server.mongo.close();
        done();
    });
    it('should get all posts', async done => {
        await supertest(app)
        .get('/api/post')
        .then(response => {
            expect(response.body).toStrictEqual<IGetPost.Success>({
                ok: true,
                posts: expect.arrayContaining(posts.map(post => post.toInterface()))
            });
        });
        done();
    });
    it('should require author query param to be an ObjectId', async done => {
        await supertest(app)
        .get('/api/post?author=objectId')
        .then(response => {
            expect(response.body).toStrictEqual<IObjectIdParse>({
                context: 'query.author',
                error: 'Object Id Parse',
                ok: false,
                provided: 'objectId'
            });
        });
        done();
    });
    it('should require id query param to be an ObjectId', async done => {
        await supertest(app)
        .get('/api/post?id=objectId')
        .then(response => {
            expect(response.body).toStrictEqual<IObjectIdParse>({
                context: 'query.id',
                error: 'Object Id Parse',
                ok: false,
                provided: 'objectId'
            });
        });
        done();
    });
    it('should notify when no ObjectIds can be parsed from ids query param', async done => {
        await supertest(app)
        .get('/api/post?ids=objectId,lol,something')
        .then(response => {
            expect(response.body).toStrictEqual<IGetPost.Success>({
                failed: {
                    ids: {
                        error: expect.any(String),
                        value: expect.any(String)
                    }
                },
                ok: true,
                posts: posts.map(post => post.toInterface()),
                'query-allowed': ['ids']
            });
        });
        done();
    });
    it('should notify when only some ObjectIds can be parsed from ids query param', async done => {
        await supertest(app)
        .get(`/api/post?ids=${posts[0].id},lol,something`)
        .then(response => {
            expect(response.body).toStrictEqual<IGetPost.Success>({
                ok: true,
                posts: [posts[0].toInterface()],
                'query-allowed': ['ids']
            });
        });
        done();
    });
    it('should get by title', async done => {
        await supertest(app)
        .get(`/api/post?title=${posts[1].title}`)
        .then(response => {
            expect(response.body).toStrictEqual<IGetPost.Success>({
                ok: true,
                posts: [posts[1].toInterface()],
                'query-allowed': ['title']
            });
        });
        done();
    });
    it('should get by author', async done => {
        await supertest(app)
        .get(`/api/post?author=${user.id}`)
        .then(response => {
            expect(response.body).toStrictEqual<IGetPost.Success>({
                ok: true,
                posts: posts.slice(0, 3).map(post => post.toInterface()),
                'query-allowed': ['author']
            });
        });
        done();
    });
    it('should get by id', async done => {
        await supertest(app)
        .get(`/api/post?id=${posts[2].id}`)
        .then(response => {
            expect(response.body).toStrictEqual<IGetPost.Success>({
                ok: true,
                posts: [posts[2].toInterface()],
                'query-allowed': ['id']
            });
        });
        done();
    });
    it('should get by ids', async done => {
        await supertest(app)
        .get(`/api/post?ids=${posts[2].id},${posts[0].id},${posts[3].id}`)
        .then(response => {
            expect(response.body).toStrictEqual<IGetPost.Success>({
                ok: true,
                posts: [posts[0], posts[2], posts[3]].map(post => post.toInterface()),
                'query-allowed': ['ids']
            });
        });
        done();
    });
    it('should include authorUser', async done => {
        await supertest(app)
        .get('/api/post?include=authorUser')
        .then(response => {
            expect(response.body).toStrictEqual<IGetPost.Success>({
                ok: true,
                posts: posts.map(post => {
                    const interfacePost = post.toInterface();
                    interfacePost.author =
                        interfacePost.author === user.id
                        ? user.toInterface()
                        : secondUser.toInterface();
                    return interfacePost;
                }),
                'query-allowed': ['include']
            });
        });
        done();
    });
});
