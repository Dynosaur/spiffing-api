import { ObjectId } from 'mongodb';
import { CommentAPI }                   from 'database/comment';
import { CommonActions }                from 'database/common-actions';
import { DatabaseInterface }            from 'database/database-interface';
import { DbPost, PostAPI, PostWrapper } from 'database/post';
import { DbRates }                      from 'database/rate';
import { DbUser, UserAPI, UserWrapper } from 'database/user';
import { DatabaseEnvironment }          from 'tests/mock/database-environment';

async function generatePosts(
    amount: number,
    int: DatabaseInterface<DbPost>,
    author: ObjectId = new ObjectId()
): Promise<PostWrapper[]> {
    const posts: PostWrapper[] = [];
    for (let i = 0; i < amount; i++)
        posts.push(
            new PostWrapper(
                await int.create({
                    author,
                    comments: [],
                    content: 'Content',
                    dislikes: 0,
                    likes: 0,
                    title: 'Title'
                })
            )
        );
    return posts;
}

describe('user-api', () => {
    let env: DatabaseEnvironment;
    let api: UserAPI;
    let common: CommonActions;
    beforeEach(async done => {
        env = new DatabaseEnvironment('user-api');
        await env.initialize();
        api = new UserAPI(
            env.interface.users,
            env.interface.posts,
            env.interface.rates,
            env.interface.comments
        );
        common = new CommonActions(api);
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    describe('create', () => {
        it('should add an entry to the user collection', async done => {
            const username = 'username';
            const wrapper = await api.create(username, common.securePassword('password'));
            expect(wrapper).toMatchObject<UserWrapper>({
                _id: expect.any(ObjectId),
                created: expect.any(Number),
                id: expect.stringMatching(/[a-f\d]{24}/),
                password: {
                    hash: expect.stringMatching(/[a-f\d]{64}/),
                    salt: expect.stringMatching(/[a-f\d]{16}/)
                },
                screenname: username,
                toInterface: expect.any(Function),
                username
            });
            expect(await env.collection.users.findOne({ _id: wrapper._id })).toStrictEqual<DbUser>({
                _id: wrapper._id,
                password: {
                    hash: expect.stringMatching(/[a-f\d]{64}/),
                    salt: expect.stringMatching(/[a-f\d]{16}/)
                },
                screenname: username,
                username
            });
            done();
        });
        it('should create a rate entry belonging to the user', async done => {
            const wrapper = await api.create('username', common.securePassword('password'));
            expect(await env.collection.rates.findOne({ owner: wrapper._id })).toStrictEqual<DbRates>({
                _id: expect.any(ObjectId),
                owner: wrapper._id,
                comments: {
                    liked: [],
                    disliked: []
                },
                posts: {
                    liked: [],
                    disliked: []
                }
            });
            done();
        });
    });
    describe('delete', () => {
        let user: UserWrapper;
        beforeEach(async done => {
            user = await api.create('username', common.securePassword('password'));
            done();
        });
        it('should unrate rated posts', async done => {
            const postAuthor = await api.create('author', common.securePassword('password'));
            const posts = await generatePosts(4, env.interface.posts, postAuthor._id);
            const rateApi = await api.getUserRateApi(user._id);
            await rateApi.likePost(posts[0]._id);
            await rateApi.likePost(posts[1]._id);
            await rateApi.dislikePost(posts[2]._id);
            await rateApi.dislikePost(posts[3]._id);
            await api.delete(user._id);
            expect(await env.collection.posts.findOne({ _id: posts[0]._id })).toMatchObject({
                likes: 0,
                dislikes: 0
            });
            expect(await env.collection.posts.findOne({ _id: posts[1]._id })).toMatchObject({
                likes: 0,
                dislikes: 0
            });
            expect(await env.collection.posts.findOne({ _id: posts[2]._id })).toMatchObject({
                likes: 0,
                dislikes: 0
            });
            expect(await env.collection.posts.findOne({ _id: posts[3]._id })).toMatchObject({
                likes: 0,
                dislikes: 0
            });
            done();
        });
        it('should remove an entry from the users collection', async done => {
            await api.delete(user._id);
            expect(await env.collection.users.findOne({ _id: user._id })).toBeNull();
            done();
        });
        it('should remove an entry from the rates collection', async done => {
            await api.delete(user._id);
            expect(await env.collection.rates.findOne({ owner: user._id })).toBeNull();
            done();
        });
        it('should remove the user\'s posts', async done => {
            await generatePosts(2, env.interface.posts, user._id);
            await api.delete(user._id);
            expect((await env.interface.posts.getMany({ author: user._id })).length).toBe(0);
            done();
        });
        it('should remove the user\'s comments', async done => {
            const postAuthor = await api.create('author', common.securePassword('password'));
            const postApi = new PostAPI(env.interface.posts, env.interface.comments);
            const commentApi = new CommentAPI(env.interface.comments, env.interface.posts);
            const post = await postApi.create(postAuthor._id, 'Title', 'Content');
            const comment = await commentApi.create(user._id, 'Content', 'post', post._id);
            await api.delete(user._id);
            expect(await env.collection.comments.findOne({ _id: comment._id })).toBeNull();
            done();
        });
    });
});
