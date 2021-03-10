import { randomBytes } from 'crypto';
import { Express }     from 'express';
import { ObjectId }    from 'mongodb';
import supertest       from 'supertest';
import { PostAPI, PostWrapper } from 'database/post';
import { UserAPI, UserWrapper }          from 'database/user';
import { IGetPosts }            from 'interface/responses/api-responses';
import { IObjectIdParseError }  from 'interface/responses/error-responses';
import { Server }               from 'server/server';
import { CommonActions } from 'database/common-actions';

async function generatePosts(amount: number, authorId: ObjectId, postApi: PostAPI): Promise<PostWrapper[]> {
    const posts: PostWrapper[] = [];
    for (let i = 0; i < amount; i++)
        posts.push(await postApi.create(authorId, randomBytes(8).toString('hex'), 'Content'));
    return posts;
}

function generateUser(userApi: UserAPI, commonApi: CommonActions): Promise<UserWrapper> {
    return userApi.create(
        `user-${Math.round(Math.random() * 1000)}`,
        commonApi.securePassword('password')
    );
}

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
        posts = (await generatePosts(3, user._id, server.postApi)).concat(
            await generatePosts(2, secondUser._id, server.postApi)
        );
        done();
    });
    afterEach(async done => {
        await server.mongo.close();
        done();
    });
    it('should get all posts', async done => {
        await supertest(app)
        .get('/api/posts')
        .then(response => {
            expect(response.body).toStrictEqual<IGetPosts.Success>({
                ok: true,
                posts: posts.map(post => post.toInterface())
            });
        });
        done();
    });
    it('should require author query param to be an ObjectId', async done => {
        await supertest(app)
        .get('/api/posts?author=objectId')
        .then(response => {
            expect(response.body).toStrictEqual<IObjectIdParseError>({
                error: 'Object Id Parse',
                ok: false,
                provided: 'objectId'
            });
        });
        done();
    });
    it('should require id query param to be an ObjectId', async done => {
        await supertest(app)
        .get('/api/posts?id=objectId')
        .then(response => {
            expect(response.body).toStrictEqual<IObjectIdParseError>({
                error: 'Object Id Parse',
                ok: false,
                provided: 'objectId'
            });
        });
        done();
    });
    it('should notify when no ObjectIds can be parsed from ids query param', async done => {
        await supertest(app)
        .get('/api/posts?ids=objectId,lol,something')
        .then(response => {
            expect(response.body).toStrictEqual<IGetPosts.Success>({
                ok: true,
                posts: posts.map(post => post.toInterface()),
                'query-allowed': ['ids'],
                failed: {
                    ids: {
                        error: expect.any(String),
                        value: expect.any(String)
                    }
                }
            });
        });
        done();
    });
    it('should notify when only some ObjectIds can be parsed from ids query param', async done => {
        await supertest(app)
        .get(`/api/posts?ids=${posts[0].id},lol,something`)
        .then(response => {
            expect(response.body).toStrictEqual<IGetPosts.Success>({
                ok: true,
                'query-allowed': ['ids'],
                posts: [posts[0].toInterface()]
            });
        });
        done();
    });
    it('should get by title', async done => {
        await supertest(app)
        .get(`/api/posts?title=${posts[1].title}`)
        .then(response => {
            expect(response.body).toStrictEqual<IGetPosts.Success>({
                ok: true,
                'query-allowed': ['title'],
                posts: [posts[1].toInterface()]
            });
        });
        done();
    });
    it('should get by author', async done => {
        await supertest(app)
        .get(`/api/posts?author=${user.id}`)
        .then(response => {
            expect(response.body).toStrictEqual<IGetPosts.Success>({
                ok: true,
                'query-allowed': ['author'],
                posts: posts.slice(0, 3).map(post => post.toInterface())
            });
        });
        done();
    });
    it('should get by id', async done => {
        await supertest(app)
        .get(`/api/posts?id=${posts[2].id}`)
        .then(response => {
            expect(response.body).toStrictEqual<IGetPosts.Success>({
                ok: true,
                'query-allowed': ['id'],
                posts: [posts[2].toInterface()]
            });
        });
        done();
    });
    it('should get by ids', async done => {
        await supertest(app)
        .get(`/api/posts?ids=${posts[2].id},${posts[0].id},${posts[3].id}`)
        .then(response => {
            expect(response.body).toStrictEqual<IGetPosts.Success>({
                ok: true,
                'query-allowed': ['ids'],
                posts: [posts[0], posts[2], posts[3]].map(post => post.toInterface())
            });
        });
        done();
    });
    it('should include authorUser', async done => {
        await supertest(app)
        .get('/api/posts?include=authorUser')
        .then(response => {
            expect(response.body).toStrictEqual<IGetPosts.Success>({
                ok: true,
                'query-allowed': ['include'],
                posts: posts.map(post => {
                    const interfacePost = post.toInterface();
                    interfacePost.author =
                        interfacePost.author === user.id
                        ? user.toInterface()
                        : secondUser.toInterface();
                    return interfacePost;
                })
            });
        });
        done();
    });
});
