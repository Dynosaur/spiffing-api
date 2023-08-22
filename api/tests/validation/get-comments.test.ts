import { generateComments, generateUsers } from './tools/generate';
import { CommentWrapper } from 'database/comment';
import { Express } from 'express';
import { IGetComment } from 'router/comment/get';
import { PostWrapper } from 'database/post';
import { Server } from 'server/server';
import { UserWrapper } from 'database/user';
import supertest   from 'supertest';

describe('get-comments route handler validation', () => {
    let app: Express;
    let server: Server;
    let users: UserWrapper[];
    let posts: PostWrapper[];
    let post1Comments: CommentWrapper[];
    let post2Comments: CommentWrapper[];
    let subcomment: CommentWrapper;
    beforeEach(async done => {
        server = new Server(false);
        await server.initialize();
        app = server.app;
        users = await generateUsers(server.userApi, server.commonApi, 3);
        posts = [
            await server.postApi.create(users[0]._id, 'Title', 'Content'),
            await server.postApi.create(users[1]._id, 'Title', 'Content')
        ];
        post1Comments = await generateComments(server.commentApi, 2, users[0]._id, 'post', posts[0]._id);
        subcomment = await server.commentApi.create(users[0]._id, 'Content', 'comment', post1Comments[0]._id);
        post1Comments[0] = (await server.commentApi.get(post1Comments[0]._id))!;
        post2Comments = await generateComments(server.commentApi, 2, users[1]._id, 'post', posts[1]._id);
        done();
    });
    afterEach(async done => {
        await server.mongo.close();
        done();
    });
    it('should get all comments', async done => {
        const response = await supertest(app).get('/api/comment');
        expect(response.body).toStrictEqual<IGetComment.Success>({
            comments: post1Comments.concat(subcomment).concat(post2Comments).map(comment => comment.toInterface()),
            ok: true
        });
        done();
    });
    it('should get all comments under a post', async done => {
        let response = await supertest(app).get(`/api/comment/?parentType=post&parentId=${posts[0].id}`);
        expect(response.body).toStrictEqual<IGetComment.Success>({
            acceptedParams: ['parentId', 'parentType'],
            comments: post1Comments.map(comment => comment.toInterface()),
            ok: true
        });
        response = await supertest(app).get(`/api/comment/?parentType=post&parentId=${posts[1].id}`);
        expect(response.body).toStrictEqual<IGetComment.Success>({
            acceptedParams: ['parentId', 'parentType'],
            comments: post2Comments.map(comment => comment.toInterface()),
            ok: true
        });
        done();
    });
    it('should get all comments under a comment', async done => {
        const response = await supertest(app)
            .get(`/api/comment/?parentType=comment&parentId=${post1Comments[0]._id}`);
        expect(response.body).toStrictEqual<IGetComment.Success>({
            acceptedParams: ['parentId', 'parentType'],
            comments: [subcomment.toInterface()],
            ok: true
        });
        done();
    });
    it('should get all comments made by a user', async done => {
        const response = await supertest(app)
            .get(`/api/comment/?author=${users[1].id}`);
        expect(response.body).toStrictEqual<IGetComment.Success>({
            acceptedParams: ['author'],
            comments: post2Comments.map(comments => comments.toInterface()),
            ok: true
        });
        done();
    });
    it('should include author\'s user object', async done => {
        const response = await supertest(app)
            .get(`/api/comment/?author=${users[0].id}&include=authorUser`);
        expect(response.body).toStrictEqual<IGetComment.Success>({
            acceptedParams: ['author', 'include'],
            comments: post1Comments.concat(subcomment).map(comment => comment.toInterface(users[0].toInterface())),
            ok: true
        });
        done();
    });
});
