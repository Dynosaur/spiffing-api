import { generatePost, generateUser } from 'tests/validation/tools/generate';
import { IDeletePost } from 'server/router/post/delete';
import { PostWrapper } from 'database/post';
import { Server } from 'server/server';
import { UserWrapper } from 'database/user';
import supertest from 'supertest';

describe('delete-post route handler validation', () => {
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
    it('should delete a post', async done => {
        const response = await supertest(server.app)
            .delete(`/api/post/${post.id}`)
            .auth(author.username, 'password');
        expect(response.body).toStrictEqual<IDeletePost.Success>({ ok: true });
        expect(server.postDbi.get({ _id: post._id })).toBeNull();
        done();
    });
});
