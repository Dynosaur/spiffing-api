import supertest   from 'supertest';
import { CommentWrapper } from 'database/comment';
import { PostWrapper }    from 'database/post';
import { UserWrapper }    from 'database/user';
import { IRateComment }   from 'interface/responses/api-responses';
import { Server }         from 'server/server';
import {
    generateComment,
    generatePost,
    generateUser
} from 'tests/validation/tools/generate';

describe('rate-comment route handler validation', () => {
    let server: Server;
    let user: UserWrapper;
    let post: PostWrapper;
    let comment: CommentWrapper;
    beforeEach(async done => {
        server = new Server();
        await server.initialize();
        user = await generateUser(server.userApi, server.commonApi);
        post = await generatePost(server.postApi, user._id);
        comment = await generateComment(server.commentApi, user._id, 'post', post._id);
        done();
    });
    afterEach(async done => {
        await server.mongo.close();
        done();
    });
    it('should like an unrated comment', async done => {
        const response = await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRateComment.Success>({
            ok: true,
            change: true
        });
        done();
    });
    it('should like a liked comment', async done => {
        await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: 1 });
        const response = await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRateComment.Success>({
            ok: true,
            change: false
        });
        done();
    });
    it('should like a disliked comment', async done => {
        await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: -1 });
        const response = await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: 1 });
        expect(response.body).toStrictEqual<IRateComment.Success>({
            ok: true,
            change: true
        });
        done();
    });
    it('should dislike an unrated comment', async done => {
        const response = await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRateComment.Success>({
            ok: true,
            change: true
        });
        done();
    });
    it('should dislike a liked comment', async done => {
        await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: 1 });
        const response = await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRateComment.Success>({
            ok: true,
            change: true
        });
        done();
    });
    it('should dislike a disliked comment', async done => {
        await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: -1 });
        const response = await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: -1 });
        expect(response.body).toStrictEqual<IRateComment.Success>({
            ok: true,
            change: false
        });
        done();
    });
    it('should unrate an unrated comment', async done => {
        const response = await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: 0 });
        expect(response.body).toStrictEqual<IRateComment.Success>({
            ok: true,
            change: false
        });
        done();
    });
    it('should unrate a liked comment', async done => {
        await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: 1 });
        const response = await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: 0 });
        expect(response.body).toStrictEqual<IRateComment.Success>({
            ok: true,
            change: true
        });
        done();
    });
    it('should unrate a disliked comment', async done => {
        await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: -1 });
        const response = await supertest(server.app)
            .post(`/api/rate/comment/${comment.id}`)
            .auth(user.username, 'password')
            .send({ rating: 0 });
        expect(response.body).toStrictEqual<IRateComment.Success>({
            ok: true,
            change: true
        });
        done();
    });
});
