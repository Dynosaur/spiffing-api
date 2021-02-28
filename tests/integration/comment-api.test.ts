import { ObjectId } from 'mongodb';
import { UserWrapper } from 'database/user/wrapper';
import { DbPost, PostWrapper } from 'database/post';
import { CommentAPI, DbComment } from 'database/comment';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';

describe('Comment API', () => {
    let env: IntegrationEnvironment;
    let user: UserWrapper;
    let post: PostWrapper;
    let api: CommentAPI;
    beforeEach(async done => {
        env = new IntegrationEnvironment('comment-api');
        await env.initialize();
        user = await env.generateUser();
        post = (await env.generatePosts(1, user._id))[0];
        api = env.comments.api;
        done();
    });
    afterEach(async done => {
        await env.closeConnections();
        done();
    });
    it('should create a comment on a post', async done => {
        const content = 'Hello.';
        const comment = await api.create(user._id, content, 'post', post._id);
        expect(await env.comments.db.findOne({ _id: comment._id })).toStrictEqual<DbComment>({
            likes: 0,
            dislikes: 0,
            replies: [],
            author: user._id,
            content: comment.content,
            _id: expect.any(ObjectId),
            parent: {
                _id: post._id,
                contentType: 'post'
            }
        });
        expect(await env.posts.db.findOne({ _id: post._id })).toStrictEqual<DbPost>({
            _id: post._id,
            author: user._id,
            comments: [comment._id],
            content: expect.any(String),
            dislikes: 0,
            likes: 0,
            title: expect.any(String)
        });
        done();
    });
    it('should create a comment on another comment', async done => {
        const originalComment = await api.create(user._id, 'Comment Content', 'post', post._id);
        const subcomment = await api.create(user._id, 'Comment Content', 'comment', originalComment._id);
        expect(await env.comments.db.findOne({ _id: subcomment._id })).toStrictEqual<DbComment>({
            likes: 0,
            dislikes: 0,
            replies: [],
            _id: subcomment._id,
            content: expect.any(String),
            author: user._id,
            parent: {
                _id: originalComment._id,
                contentType: 'comment'
            }
        });
        expect(await env.comments.db.findOne({ _id: originalComment._id })).toStrictEqual<DbComment>({
            likes: 0,
            dislikes: 0,
            replies: [subcomment._id],
            _id: originalComment._id,
            author: user._id,
            content: expect.any(String),
            parent: expect.anything()
        });
        done();
    });
    it('should delete a comment', async done => {
        let comment = await api.create(user._id, 'Comment Content', 'post', post._id);
        await api.delete(comment._id.toHexString());
        expect(await env.comments.db.findOne({ _id: comment._id })).toBeNull();
        comment = await api.create(user._id, 'Comment Content', 'post', post._id);
        const subcomment = await api.create(user._id, 'Comment Content', 'comment', comment._id);
        await env.comments.api.delete(comment._id.toHexString());
        expect(await env.comments.db.findOne({ _id: comment._id })).toStrictEqual<DbComment>({
            _id: comment._id,
            author: null as any,
            content: null as any,
            dislikes: 0,
            likes: 0,
            parent: {
                _id: post._id,
                contentType: 'post'
            },
            replies: [subcomment._id]
        });
        done();
    });
});
