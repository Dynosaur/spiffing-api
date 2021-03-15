import { IGetPosts, getPosts } from 'router/post/get';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { PostWrapper } from 'database/post';
import { UserWrapper } from 'database/user';

describe('get-posts route handler', () => {
    let env: IntegrationEnvironment;
    let author: UserWrapper;
    let posts: PostWrapper[];
    beforeEach(async done => {
        env = new IntegrationEnvironment('get-posts');
        await env.initialize();
        author = await env.generateUser();
        posts = await env.generatePosts(5, author._id);
        done();
    });
    afterEach(async done => {
        await env.destroy();
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
            env.request.query.id = posts[0].id;
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
            env.request.query.ids = requestedPosts.map(post => post.id).join(',');
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
        env.request.query.id = posts[0].id;
        response = await env.executeRouteHandler(getPosts);
        expect(response.payload).toStrictEqual<IGetPosts.Success>({
            ok: true,
            posts: [posts[0].toInterface()],
            'query-allowed': ['id']
        });
        done();
    });
    it('should include author as a User if requested', async done => {
        env.request.query.id = posts[0].id;
        env.request.query.include = 'authorUser';
        const response = await env.executeRouteHandler(getPosts);
        expect(response.payload).toStrictEqual<IGetPosts.Success>({
            ok: true,
            posts: [{
                _id: posts[0].id,
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
