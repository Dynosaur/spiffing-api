import supertest from 'supertest';
import { Server } from 'server/server';
import { Express } from 'express';
import { GetUser } from 'interface/responses/api-responses';
import { Automated } from 'interface/responses/error-responses';
import { randomBytes } from 'crypto';
import { Authenticate, Deregister, Patch, Register } from 'interface/responses/auth-endpoints';

describe('auth router validation', () => {
    let app: Express;
    let server: Server;
    let username = 'hello';
    let screenname = username;
    let password = 'world';

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
                    expect(res.body).toStrictEqual<Register.Ok.Created>({
                        ok: true,
                        user: {
                            _id: expect.stringMatching(/[a-f\d]{24}/),
                            created: expect.any(Number),
                            screenname: username,
                            username: username
                        }
                    });
                });
            await supertest(app)
                .get(`/api/user/${username}`)
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<GetUser.Ok.UserFound>({
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
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<Register.Failed.UserExists>({
                        error: 'User Already Exists',
                        ok: false
                    });
                });

            done();
        });
    });

    describe('authenticate', () => {
        it('should authenticate', async done => {
            await supertest(app)
                .post('/api/authenticate')
                .auth(username, password)
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<Authenticate.Ok>({ ok: true });
                });
            done();
        });
        it('should not authenticate', async done => {
            await supertest(app)
                .post('/api/authenticate')
                .auth(username, randomBytes(16).toString('hex'))
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<Authenticate.Failed>({
                        error: 'Authorization Failed',
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
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<Automated.Failed.Unauthorized>({
                        error: 'Authorization Failed',
                        ok: false
                    });
                });
            await supertest(app)
                .post('/api/authenticate')
                .auth(username, password)
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual({
                        ok: true
                    });
                });
            done();
        });
        it('should update username', async done => {
            const newUsername = 'Johari';
            await supertest(app)
                .patch(`/api/user/${username}`)
                .auth(username, password)
                .send({ username: newUsername })
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<Patch.Ok.Updated>({
                        ok: true,
                        updated: ['username']
                    });
                });
            username = newUsername;
            await supertest(app)
                .post('/api/authenticate')
                .auth(username, password)
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual({
                        ok: true
                    });
                });
            done();
        });
        it('should update password', async done => {
            const newPassword = 'theb3stKn0w';
            await supertest(app)
                .patch(`/api/user/${username}`)
                .auth(username, password)
                .send({ password: newPassword })
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<Patch.Ok.Updated>({
                        ok: true,
                        updated: ['password']
                    });
                });
            password = newPassword;
            await supertest(app)
                .post('/api/authenticate')
                .auth(username, password)
                .expect(200).then(res => {
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
                .patch(`/api/user/${username}`)
                .auth(username, password)
                .send({ username: newUsername, password: newPassword })
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<Patch.Ok.Updated>({
                        ok: true,
                        updated: ['username', 'password']
                    });
                });
            username = newUsername;
            password = newPassword;
            await supertest(app)
                .post('/api/authenticate')
                .auth(username, password)
                .expect(200).then(res => {
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
                .delete(`/api/user/${username}`)
                .auth(username, randomBytes(16).toString('hex'))
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<Automated.Failed.Unauthorized>({
                        error: 'Authorization Failed',
                        ok: false
                    });
                });
            await supertest(app)
                .get(`/api/user/${username}`)
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<GetUser.Ok.UserFound>({
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
                .delete(`/api/user/${username}`)
                .auth(username, password)
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<Deregister.Ok>({ ok: true });
                });
            await supertest(app)
                .get(`/api/user/${username}`)
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<GetUser.Failed.UserNotFound>({
                        error: 'User Not Found',
                        ok: false
                    });
                });
            done();
        });
    });

});
