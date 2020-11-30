import supertest from 'supertest';
import { Server } from 'server/server';
import { Express } from 'express';
import { randomBytes } from 'crypto';
import { DeregisterEndpoint, PatchEndpoint, PatchUpdatedResponse, RegisterCreatedResponse } from 'app/server/interface/responses/auth-endpoints';
import { GetUserErrorResponse, GetUserFoundResponse } from 'app/server/interface/responses/api-responses';

process.env.environment = 'DEV';
process.env.KEY = randomBytes(32).toString('hex');

describe('authentication and authorization', () => {

    let app: Express;
    let server: Server;

    let username = 'hello';
    let password = 'world';

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
                .expect(201).then(res => {
                    expect(res.body).toStrictEqual<RegisterCreatedResponse>({
                        ok: true,
                        status: 'Ok',
                        user: expect.objectContaining({
                            screenname: username,
                            username
                        })
                    });
                });

            await supertest(app)
                .get(`/api/user/${username}`)
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<GetUserFoundResponse>({
                        ok: true,
                        user: expect.objectContaining({
                            screenname: username,
                            username
                        })
                    });
                });

            done();
        });
        it('should not create a user if the username is taken', async done => {
            await supertest(app)
                .post(`/api/user/${username}`)
                .auth(username, password)
                .expect(200).then(res => {
                    expect(res.body.ok).toBe(false);
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
                    expect(res.body.ok).toBe(true);
                });
            done();
        });
        it('should not authenticate', async done => {
            await supertest(app)
                .post('/api/authenticate')
                .auth(username, randomBytes(16).toString('hex'))
                .expect(200).then(res => {
                    expect(res.body.ok).toBe(false);
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
                    expect(res.body).toStrictEqual<PatchEndpoint>({
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
                    expect(res.body).toStrictEqual<PatchUpdatedResponse>({
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
                    expect(res.body).toStrictEqual<PatchUpdatedResponse>({
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
                    expect(res.body).toStrictEqual<PatchUpdatedResponse>({
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
                    expect(res.body).toStrictEqual<DeregisterEndpoint>({
                        error: 'Authorization Failed',
                        ok: false
                    });
                });
            await supertest(app)
                .get(`/api/user/${username}`)
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<GetUserFoundResponse>({
                        ok: true,
                        user: expect.objectContaining({
                            username
                        })
                    });
                });
            done();
        });
        it('should delete the user and its posts', async done => {
            await supertest(app)
                .delete(`/api/user/${username}`)
                .auth(username, password)
                .expect(200).then(res => {
                    expect(res.body.ok).toBe(true);
                });
            await supertest(app)
                .get(`/api/user/${username}`)
                .expect(200).then(res => {
                    expect(res.body).toStrictEqual<GetUserErrorResponse>({
                        error: 'User Not Found',
                        ok: false
                    });
                });
            done();
        });
    });

});
