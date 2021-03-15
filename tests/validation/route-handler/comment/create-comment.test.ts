import supertest from 'supertest';
import { PostWrapper }                from 'database/post';
import { UserWrapper }                from 'database/user';
import { ICreateComment }             from 'router/comment/create-comment';
import { Server }                     from 'server/server';
import { generatePost, generateUser } from 'tests/validation/tools/generate';

describe('create-comment route handler validation', () => {
    let server: Server;
    let author: UserWrapper;
    let post: PostWrapper;
    beforeEach(async done => {
        server = new Server();
        await server.initialize();
        author = await generateUser(server.userApi, server.commonApi);
        post = await generatePost(server.postApi, author._id);
        done();
    });
    afterEach(async done => {
        await server.mongo.close();
        done();
    });
    it('should create a comment on a post', async done => {
        const response = await supertest(server.app)
            .post(`/api/comment/post/${post.id}`)
            .auth(author.username, 'password')
            .send({ content: 'Content' });
        expect(response.body).toStrictEqual<ICreateComment.Success>({
            ok: true,
            comment: {
                _id: expect.stringMatching(/^[a-f\d]{24}$/),
                author: author.id,
                content: 'Content',
                created: expect.any(Number),
                dislikes: 0,
                likes: 0,
                parent: {
                    _id: post.id,
                    contentType: 'post'
                },
                replies: []
            }
        });
        done();
    });
    it('should create a comment on a comment', async done => {
        const parentComment = await server.commentApi.create(author._id, 'Content', 'post', post._id);
        const response = await supertest(server.app)
            .post(`/api/comment/comment/${parentComment.id}`)
            .auth(author.username, 'password')
            .send({ content: 'Content' });
        expect(response.body).toStrictEqual<ICreateComment.Success>({
            ok: true,
            comment: {
                _id: expect.stringMatching(/^[a-f\d]{24}$/),
                author: author.id,
                content: 'Content',
                created: expect.any(Number),
                dislikes: 0,
                likes: 0,
                parent: {
                    _id: parentComment.id,
                    contentType: 'comment'
                },
                replies: []
            }
        });
        done();
    });
});
