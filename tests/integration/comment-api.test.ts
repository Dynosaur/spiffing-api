import { DbPost } from 'database/data-types';
import { ObjectId } from 'mongodb';
import { BoundUser } from 'database/dbi/user-api';
import { BoundPost } from 'database/dbi/post-actions';
import { DbComment } from 'database/data-types/comment';
import { CommentAPI } from 'database/dbi/comment/comment-api';
import { IntegrationEnvironment } from 'tests/mock/integration/integration-environment';

describe('Comment API', () => {
    let env: IntegrationEnvironment;
    let user: BoundUser;
    let post: BoundPost;
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
        const bound = await api.createComment(user._id, content, post);
        expect(await env.comments.db.findOne({ _id: bound.getObjectId() })).toStrictEqual<DbComment>({
            likes: 0,
            dislikes: 0,
            replies: [],
            author: user._id,
            content: bound.getContent(),
            _id: expect.any(ObjectId),
            parent: {
                _id: post.getObjectId(),
                contentType: 'post'
            }
        });
        expect(await env.posts.db.findOne({ _id: post.getObjectId() })).toStrictEqual<DbPost>({
            _id: post.getObjectId(),
            author: user._id,
            comments: [bound.getObjectId()],
            content: expect.any(String),
            dislikes: 0,
            likes: 0,
            title: expect.any(String)
        });
        done();
    });
    it('should create a comment on another comment', async done => {
        const originalComment = await api.createComment(user._id, 'Comment Content', post);
        const subcomment = await api.createComment(user._id, 'Comment Content', originalComment);
        expect(await env.comments.db.findOne({ _id: subcomment.getObjectId() })).toStrictEqual<DbComment>({
            likes: 0,
            dislikes: 0,
            replies: [],
            _id: subcomment.getObjectId(),
            content: expect.any(String),
            author: user._id,
            parent: {
                _id: originalComment.getObjectId(),
                contentType: 'comment'
            }
        });
        expect(await env.comments.db.findOne({ _id: originalComment.getObjectId() })).toStrictEqual<DbComment>({
            likes: 0,
            dislikes: 0,
            replies: [subcomment.getObjectId()],
            _id: originalComment.getObjectId(),
            author: user._id,
            content: expect.any(String),
            parent: expect.anything()
        });
        done();
    });
    it('should delete a comment', async done => {
        let comment = await api.createComment(user._id, 'Comment Content', post);
        await api.deleteComment(comment.getStringId());
        expect(await env.comments.db.findOne({ _id: comment.getObjectId() })).toBeNull();
        comment = await api.createComment(user._id, 'Comment Content', post);
        const subcomment = await api.createComment(user._id, 'Comment Content', comment);
        await comment.delete();
        expect(await env.comments.db.findOne({ _id: comment.getObjectId() })).toStrictEqual<DbComment>({
            _id: comment.getObjectId(),
            author: null,
            content: null,
            dislikes: 0,
            likes: 0,
            parent: {
                _id: post.getObjectId(),
                contentType: 'post'
            },
            replies: [subcomment.getObjectId()]
        });
        done();
    });
});
