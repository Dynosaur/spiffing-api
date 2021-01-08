import supertest from 'supertest';
import { Server } from 'server/server';
import { Express } from 'express';
import { IGetUser } from 'interface/responses/api-responses';
import { randomBytes } from 'crypto';
import { INoUserFoundError, IUnauthorizedError } from 'app/server/interface/responses/error-responses';
import { IAuthorize, IDeregister, IPatch, IRegister } from 'interface/responses/auth-endpoints';

describe('auth router validation', () => {
    let app: Express;
    let server: Server;
    let username = 'hello';
    let screenname = username;
    let password = 'world';
    let uid: string;

    beforeAll(() => {
        process.env.environment = 'DEV';
        process.env.KEY = randomBytes(32).toString('hex');
    });

    beforeEach(async done => {
        server = new Server(false);
        await server.initialize();
        app = server.app;
        done();
    });

    afterEach(async done => {
        await server.mongo.client.close();
        done();
    });

    describe('register', () => {
        it('should create a new user', async done => {
            await supertest(app)
                .post(`/api/user/${username}`)
                .auth(username, password)
                .then(res => {
                    expect(res.body).toStrictEqual<IRegister.Success>({
                        ok: true,
                        user: {
                            _id: expect.stringMatching(/[a-f\d]{24}/),
                            created: expect.any(Number),
                            screenname: username,
                            username: username
                        }
                    });
                    uid = res.body.user._id;
                });
            await supertest(app)
                .get(`/api/user/${username}`)
                .then(res => {
                    expect(res.body).toStrictEqual<IGetUser.Success>({
                        ok: true,
                        user: {
                            _id: expect.stringMatching(/[a-f\d]{24}/),
                            created: expect.any(Number),
                            screenname: username,
                            username: username
                        }
                    });
                });

            done();
        });
        it('should not create a user if the username is taken', async done => {
            await supertest(app)
                .post(`/api/user/${username}`)
                .auth(username, password)
                .then(res => {
                    expect(res.body).toStrictEqual<IRegister.Failed.UserExists>({
                        error: 'User Already Exists',
                        ok: false
                    });
                });

            done();
        });
    });

    describe('authorize', () => {
        it('should authorize', async done => {
            await supertest(app)
                .post(`/api/authorize/${uid}`)
                .auth(username, password)
                .then(res => {
                    expect(res.body).toStrictEqual<IAuthorize.Success>({ ok: true });
                });
            done();
        });
        it('should not authenticate', async done => {
            await supertest(app)
                .post(`/api/authorize/${uid}`)
                .auth(username, randomBytes(16).toString('hex'))
                .then(res => {
                    expect(res.body).toStrictEqual<IAuthorize.ErrTx>({
                        error: 'Unauthorized',
                        ok: false
                    });
                });
            done();
        });
    });

    describe('patch', () => {
        it('should not update if authentication fails', async done => {
            await supertest(app)
                .patch(`/api/user/${username}`)
                .auth(username, randomBytes(16).toString('hex'))
                .send({ username: 'hard2explain' })
                .then(res => {
                    expect(res.body).toStrictEqual<IUnauthorizedError>({
                        error: 'Unauthorized',
                        ok: false
                    });
                });
            await supertest(app)
                .post(`/api/authorize/${uid}`)
                .auth(username, password)
                .then(res => {
                    expect(res.body).toStrictEqual({
                        ok: true
                    });
                });
            done();
        });
        it('should update username', async done => {
            const newUsername = 'Johari';
            await supertest(app)
                .patch(`/api/user/${uid}`)
                .auth(username, password)
                .send({ username: newUsername })
                .then(res => {
                    expect(res.body).toStrictEqual<IPatch.Success>({
                        ok: true,
                        'rejected-props': [],
                        updated: ['username']
                    });
                });
            username = newUsername;
            await supertest(app)
                .post(`/api/authorize/${uid}`)
                .auth(username, password)
                .then(res => {
                    expect(res.body).toStrictEqual({
                        ok: true
                    });
                });
            done();
        });
        it('should update password', async done => {
            const newPassword = 'theb3stKn0w';
            await supertest(app)
                .patch(`/api/user/${uid}`)
                .auth(username, password)
                .send({ password: newPassword })
                .then(res => {
                    expect(res.body).toStrictEqual<IPatch.Success>({
                        ok: true,
                        'rejected-props': [],
                        updated: ['password']
                    });
                });
            password = newPassword;
            await supertest(app)
                .post(`/api/authorize/${uid}`)
                .auth(username, password)
                .then(res => {
                    expect(res.body).toStrictEqual({
                        ok: true
                    });
                });
            done();
        });
        it ('should update username and password', async done => {
            const newUsername = 'CandyStoreOfOurs';
            const newPassword = 'Som3Feather5!';
            await supertest(app)
                .patch(`/api/user/${uid}`)
                .auth(username, password)
                .send({ username: newUsername, password: newPassword })
                .then(res => {
                    expect(res.body).toStrictEqual<IPatch.Success>({
                        ok: true,
                        'rejected-props': [],
                        updated: ['username', 'password']
                    });
                });
            username = newUsername;
            password = newPassword;
            await supertest(app)
                .post(`/api/authorize/${uid}`)
                .auth(username, password)
                .then(res => {
                    expect(res.body).toStrictEqual({
                        ok: true
                    });
                });
            done();
        });
    });

    describe('deregister', () => {
        it('should not delete if authentication fails', async done => {
            await supertest(app)
                .delete(`/api/user/${uid}`)
                .auth(username, randomBytes(16).toString('hex'))
                .then(res => {
                    expect(res.body).toStrictEqual<IUnauthorizedError>({
                        error: 'Unauthorized',
                        ok: false
                    });
                });
            await supertest(app)
                .get(`/api/user/${uid}`)
                .then(res => {
                    expect(res.body).toStrictEqual<IGetUser.Success>({
                        ok: true,
                        user: {
                            _id: expect.stringMatching(/[a-f\d]{24}/),
                            created: expect.any(Number),
                            screenname: screenname,
                            username
                        }
                    });
                });
            done();
        });
        it('should delete the user and its posts', async done => {
            await supertest(app)
                .delete(`/api/user/${uid}`)
                .auth(username, password)
                .then(res => {
                    expect(res.body).toStrictEqual<IDeregister.Success>({ ok: true });
                });
            await supertest(app)
                .get(`/api/user/${uid}`)
                .then(res => {
                    expect(res.body).toStrictEqual<INoUserFoundError>({
                        error: 'No User Found',
                        id: uid,
                        ok: false
                    });
                });
            done();
        });
    });

});
