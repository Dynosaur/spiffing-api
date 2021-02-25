import { getPosts } from 'router/api-router';
import { BoundUser } from 'database/dbi/user-api';
import { BoundPost } from 'database/dbi/post-actions';
import { IGetPosts } from 'interface/responses/api-responses';
import { IntegrationEnvironment } from 'tests/mock/integration/integration-environment';

describe('getPosts route handler', () => {
    let env: IntegrationEnvironment;
    let author: BoundUser;
    let posts: BoundPost[];
    beforeEach(async done => {
        env = new IntegrationEnvironment('getPosts');
        await env.initialize();
        author = await env.generateUser();
        posts = await env.generatePosts(5, author._id);
        done();
    });
    afterEach(async done => {
        await env.closeConnections();
        done();
    });
    describe('allowed queries', () => {
        it('should query by author', async done => {
            env.request.query.author = author.id;
            const response = await env.executeRouteHandler(getPosts);
            expect(response.payload).toStrictEqual<IGetPosts.Success>({
                ok: true,
                posts: posts.map(post => post.toInterface()),
                'query-allowed': ['author']
            });
            done();
        });
        it('should query by id', async done => {
            env.request.query.id = posts[0].getIdString();
            const response = await env.executeRouteHandler(getPosts);
            expect(response.payload).toStrictEqual<IGetPosts.Success>({
                ok: true,
                posts: [posts[0].toInterface()],
                'query-allowed': ['id']
            });
            done();
        });
        it('should query by ids', async done => {
            const requestedPosts = posts.slice(0, 2);
            env.request.query.ids = requestedPosts.map(post => post.getIdString()).join(',');
            const response = await env.executeRouteHandler(getPosts);
            expect(response.payload).toStrictEqual<IGetPosts.Success>({
                ok: true,
                posts: requestedPosts.map(post => post.toInterface()),
                'query-allowed': ['ids']
            });
            done();
        });
    });
    it('should return requested posts', async done => {
        let response = await env.executeRouteHandler(getPosts);
        expect(response.payload).toStrictEqual<IGetPosts.Success>({
            ok: true,
            posts: posts.map(post => post.toInterface())
        });
        env.request.query.id = posts[0].getIdString();
        response = await env.executeRouteHandler(getPosts);
        expect(response.payload).toStrictEqual<IGetPosts.Success>({
            ok: true,
            posts: [posts[0].toInterface()],
            'query-allowed': ['id']
        });
        done();
    });
    it('should include author as a User if requested', async done => {
        env.request.query.id = posts[0].getIdString();
        env.request.query.include = 'authorUser';
        const response = await env.executeRouteHandler(getPosts);
        expect(response.payload).toStrictEqual<IGetPosts.Success>({
            ok: true,
            posts: [{
                _id: posts[0].getIdString(),
                author: {
                    _id: author.id,
                    created: expect.any(Number),
                    screenname: author.screenname,
                    username: author.username
                },
                comments: [],
                content: expect.any(String),
                date: expect.any(Number),
                dislikes: 0,
                likes: 0,
                title: expect.any(String)
            }],
            'query-allowed': ['id', 'include']
        });
        done();
    });
});
