import supertest from 'supertest';
import { PostWrapper }                                 from 'database/post';
import { UserWrapper }                                 from 'database/user';
import { IDeleteComment }                              from 'router/comment/delete-comment';
import { Server }                                      from 'server/server';
import { generateComment, generatePost, generateUser } from 'tests/validation/tools/generate';

describe('delete-comment route handler validation', () => {
    let server: Server;
    let user: UserWrapper;
    let post: PostWrapper;
    beforeEach(async done => {
        server = new Server();
        await server.initialize();
        user = await generateUser(server.userApi, server.commonApi);
        post = await generatePost(server.postApi, user._id);
        done();
    });
    afterEach(async done => {
        await server.mongo.close();
        done();
    });
    it('should delete a comment', async done => {
        const comment = await generateComment(server.commentApi, user._id, 'post', post._id);
        const response = await supertest(server.app)
            .delete(`/api/comment/${comment.id}`);
        expect(response.body).toStrictEqual<IDeleteComment.Success>({
            ok: true,
            fullyDeleted: true
        });
        done();
    });
    it('shouldn\'t fully delete the comment if there are subcomments', async done => {
        const parentComment = await generateComment(server.commentApi, user._id, 'post', post._id);
        await generateComment(server.commentApi, user._id, 'comment', parentComment._id);
        const response = await supertest(server.app)
            .delete(`/api/comment/${parentComment.id}`);
        expect(response.body).toStrictEqual<IDeleteComment.Success>({
            ok: true,
            fullyDeleted: false
        });
        done();
    });
});
