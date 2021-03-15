import { DbPost, PostAPI, PostWrapper } from 'database/post';
import { UserAPI, UserWrapper } from 'database/user';
import { CommentAPI } from 'database/comment';
import { CommonActions } from 'database/common-actions';
import { DatabaseEnvironment } from 'tests/mock/database-environment';
import { DbRates } from 'database/rate';
import { ObjectID } from 'mongodb';

describe('post-api', () => {
    let env: DatabaseEnvironment;
    let api: PostAPI;
    beforeEach(async done => {
        env = new DatabaseEnvironment('post-api');
        await env.initialize();
        api = new PostAPI(env.interface.posts, env.interface.comments, env.interface.rates);
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    describe('delete', () => {
        let userApi: UserAPI;
        let commonActions: CommonActions;
        let commentApi: CommentAPI;
        let user: UserWrapper;
        let post: PostWrapper;
        beforeEach(async done => {
            userApi = new UserAPI(env.interface.users, env.interface.posts, env.interface.rates, env.interface.comments);
            commonActions = new CommonActions(userApi);
            commentApi = new CommentAPI(env.interface.comments, env.interface.posts);
            const username = 'user-' + Math.round(Math.random() * 1000);
            user = await userApi.create(username, commonActions.securePassword('password'));
            post = await api.create(user._id, 'Title', 'Content');
            done();
        });
        it('should delete the post', async done => {
            await api.delete(post._id);
            expect(await env.collection.posts.findOne({ _id: post._id })).toBeNull();
            done();
        });
        it('should remove a deleted post from other user\'s rated posts', async done => {
            const other = await userApi.create('other-user', commonActions.securePassword('password'));
            const rateApi = await userApi.getUserRateApi(other._id);
            await rateApi.likePost(post._id);
            await api.delete(post._id);
            expect(await env.collection.rates.findOne({ owner: other._id })).toStrictEqual<DbRates>({
                _id: expect.any(ObjectID),
                comments: {
                    disliked: [],
                    liked: []
                },
                owner: other._id,
                posts: {
                    disliked: [],
                    liked: []
                }
            });
            done();
        });
        it('should not delete post completely if there are comments', async done => {
            const comment = await commentApi.create(user._id, 'Content', 'post', post._id);
            await api.delete(post._id);
            expect(await env.collection.posts.findOne({ _id: post._id })).toStrictEqual<DbPost>({
                _id: post._id,
                author: null!,
                comments: [comment._id],
                content: null!,
                dislikes: 0,
                likes: 0,
                title: null!
            });
            done();
        });
    });
});
