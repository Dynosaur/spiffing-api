import supertest from 'supertest';
import { CommentWrapper } from 'database/comment';
import { PostWrapper }    from 'database/post';
import { UserWrapper }    from 'database/user';
import { IGetComment }    from 'server/router/comment/get';
import { Server }         from 'server/server';
import { generateComments, generatePost, generateUser } from 'tests/validation/tools/generate';

describe('get-comment route handler validation', () => {
    let server: Server;
    let user: UserWrapper;
    let post: PostWrapper;
    let comments: CommentWrapper[];
    beforeEach(async done => {
        server = new Server();
        await server.initialize();
        user = await generateUser(server.userApi, server.commonApi);
        post = await generatePost(server.postApi, user._id);
        comments = await generateComments(server.commentApi, 4, user._id, 'post', post._id);
        done();
    });
    afterEach(async done => {
        await server.mongo.close();
        done();
    });
    it('should get all comments', async done => {
        const response = await supertest(server.app)
            .get('/api/comment');
        expect(response.body).toStrictEqual<IGetComment.Success>({
            ok: true,
            comments: comments.map(comment => comment.toInterface())
        });
        done();
    });
});
