import supertest   from 'supertest';
import { Express } from 'express';
import { CommentWrapper } from 'database/comment';
import { PostWrapper }    from 'database/post';
import { UserWrapper }    from 'database/user';
import { IGetComments }   from 'interface/responses/api-responses';
import { Server }         from 'server/server';

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
        users = [];
        for (let i = 0; i < 3; i++) users.push(await server.userApi.create(
            `user-${Math.round(Math.random() * 1000)}`, server.actions.common.securePassword('password')
        ));
        posts = [
            await server.postApi.create(users[0]._id, 'Title', 'Content'),
            await server.postApi.create(users[1]._id, 'Title', 'Content')
        ];
        post1Comments = [];
        post2Comments = [];
        for (let i = 0; i < 2; i++)
            post1Comments.push(await server.commentApi.create(users[0]._id, 'Content', 'post', posts[0]._id));
        subcomment = await server.commentApi.create(users[0]._id, 'Content', 'comment', post1Comments[0]._id);
        post1Comments[0] = (await server.commentApi.get(post1Comments[0].id))!;
        for (let i = 0; i < 2; i++)
            post2Comments.push(await server.commentApi.create(users[1]._id, 'Content', 'post', posts[1]._id));
        done();
    });
    afterEach(async done => {
        await server.mongo.close();
        done();
    });
    it('should get all comments', async done => {
        const response = await supertest(app).get('/api/comments');
        expect(response.body).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: post1Comments.concat(subcomment).concat(post2Comments).map(comment => comment.toInterface())
        });
        done();
    });
    it('should get all comments under a post', async done => {
        let response = await supertest(app).get(`/api/comments/?parentType=post&parentId=${posts[0].id}`);
        expect(response.body).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: post1Comments.map(comment => comment.toInterface()),
            acceptedParams: ['parentId', 'parentType']
        });
        response = await supertest(app).get(`/api/comments/?parentType=post&parentId=${posts[1].id}`);
        expect(response.body).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: post2Comments.map(comment => comment.toInterface()),
            acceptedParams: ['parentId', 'parentType']
        });
        done();
    });
    it('should get all comments under a comment', async done => {
        const response = await supertest(app)
            .get(`/api/comments/?parentType=comment&parentId=${post1Comments[0]._id}`);
        expect(response.body).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: [subcomment.toInterface()],
            acceptedParams: ['parentId', 'parentType']
        });
        done();
    });
    it('should get all comments made by a user', async done => {
        const response = await supertest(app)
            .get(`/api/comments/?author=${users[1].id}`);
        expect(response.body).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: post2Comments.map(comments => comments.toInterface()),
            acceptedParams: ['author']
        });
        done();
    });
    it('should include author\'s user object', async done => {
        const response = await supertest(app)
            .get(`/api/comments/?author=${users[0].id}&include=authorUser`);
        expect(response.body).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: post1Comments.concat(subcomment).map(comment => comment.toInterface(users[0].toInterface())),
            acceptedParams: ['author', 'include'],
            includeSuccessful: true
        });
        done();
    });
});
