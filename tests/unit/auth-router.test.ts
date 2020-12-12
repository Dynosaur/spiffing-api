import { hash } from '../../src/tools/crypto';
import { MockEnvironment } from '../mock/mock-environment';
import { Authenticate, Deregister, Patch, Register } from 'interface/responses/auth-endpoints';
import { authenticate, deregister, patchUser, register } from 'server/router/auth-router';

describe('auth unit tests', () => {
    describe('register', () => {
        it('should check if the user exists already', async done => {
            const mock = new MockEnvironment();

            await mock.runRouteHandler(register, { username: 'hello', password: 'world' });
            expect(mock.users.findSpy).toBeCalledWith({ username: 'hello' });

            done();
        });
        it('should create a user', async done => {
            const mock = new MockEnvironment();
            const username = 'hello';
            const password = 'world';

            await mock.runRouteHandler(register, { username, password });
            expect(mock.users.insertOneSpy).toBeCalledWith(expect.objectContaining({ username, password }));
            expect(mock.users.data[0]).toEqual(expect.objectContaining({ username, password }));

            done();
        });
        it('should return ok and the user when created', async done => {
            const mock = new MockEnvironment();
            const username = 'hello';
            const password = 'world';

            const resp = await mock.runRouteHandler(register, { username, password });
            expect(resp.payload).toStrictEqual<Register.Ok.Created>({
                ok: true,
                status: 'Created',
                user: expect.objectContaining({ username })
            });

            done();
        });
        it('should return an error if the username is taken', async done => {
            const mock = new MockEnvironment();
            const username = 'hello';
            mock.createUser(username);
            mock.request.params.username = username;

            const resp = await mock.runRouteHandler(register, { username });
            expect(mock.users.insertOneSpy).not.toBeCalled();
            expect(resp.payload).toStrictEqual<Register.Failed.UserExists>({
                error: 'User Already Exists',
                ok: false
            });

            done();
        });
    });
    describe('authenticate', () => {
        it('should return OK', async done => {
            const mock = new MockEnvironment();

            const resp = await mock.runRouteHandler(authenticate);
            expect(resp.payload).toMatchObject<Authenticate.Ok>({ ok: true });
            done();
        });
    });
    describe('deregister', () => {
        it('should return an error if the user does not exist', async done => {
            const mock = new MockEnvironment();

            const response = await mock.runRouteHandler(deregister, { username: 'hello' });
            expect(mock.users.findSpy).toBeCalledWith({ username: 'hello' });
            expect(response.payload).toStrictEqual<Deregister.Failed.NoUser>({
                error: 'No User',
                ok: false
            });

            done();
        });
        it('should remove the user from the database', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();
            const keepUsers = mock.generateUsers(9);

            await mock.runRouteHandler(deregister, { username: user.username });
            expect(mock.users.deleteManySpy).toBeCalledWith({ _id: user._id });
            expect(mock.users.data).not.toContain(user);
            expect(mock.users.data).toEqual(expect.arrayContaining(keepUsers));

            done();
        });
        it('should remove the user\'s posts from the database', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();
            const removePosts = mock.generatePosts(5, user._id);
            const keepPosts = mock.generatePosts(5);

            await mock.runRouteHandler(deregister, { username: user.username });
            expect(mock.posts.deleteManySpy).toBeCalledWith({ author: user._id });
            expect(mock.users.data).not.toEqual(expect.arrayContaining(removePosts));
            expect(mock.posts.data).toEqual(expect.arrayContaining(keepPosts));

            done();
        });
        it('should return ok', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();
            mock.generatePosts(3, user._id);

            const response = await mock.runRouteHandler(deregister, { username: user.username });
            expect(response.payload).toStrictEqual<Deregister.Ok>({ ok: true });

            done();
        });
    });
    describe('patchUser', () => {
        it('should check that the user exists', async done => {
            const mock = new MockEnvironment();

            const response = await mock.runRouteHandler(patchUser, { username: 'hello' });
            expect(mock.users.findSpy).toBeCalledWith({ username: 'hello' });
            expect(response.payload).toStrictEqual<Patch.Failed.NoUser>({
                error: 'No User',
                ok: false
            });

            done();
        });
        it('should handle no updates provided', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();

            const response = await mock.runRouteHandler(patchUser, { username: user.username });
            expect(mock.users.updateManySpy).not.toBeCalled();
            expect(response.payload).toStrictEqual<Patch.Ok.Updated>({
                ok: true,
                updated: []
            });

            done();
        });
        it('should update username in database and return updates', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();
            const oldUsername = user.username;
            const updatedUsername = 'Ghost Bath';
            mock.request.body.username = updatedUsername;

            const response = await mock.runRouteHandler(patchUser, { username: oldUsername });
            expect(mock.users.updateManySpy).toBeCalledWith({ _id: user._id }, { $set: { username: updatedUsername } });
            expect(mock.users.data).toContainEqual(expect.objectContaining({
                _id: user._id,
                username: updatedUsername
            }));
            expect(response.payload).toStrictEqual<Patch.Ok.Updated>({
                ok: true,
                updated: ['username']
            });

            done();
        });
        it('should update password in database and return updates', async done => {
            const mock = new MockEnvironment();
            const oldPassword = 'password';
            const newPassword = 'F4%43!&';
            const user = mock.createUser(undefined, oldPassword);
            mock.request.body.password = newPassword;

            const response = await mock.runRouteHandler(patchUser, { username: user.username });
            const dbUser = mock.users.data[0];
            expect(mock.users.findSpy).toBeCalledWith({ username: user.username });
            expect(mock.users.updateManySpy).toBeCalledWith({ _id: user._id }, expect.anything());
            expect(mock.commonActions.cipher.decrypt(dbUser.password.hash)).toBe(hash(newPassword, dbUser.password.salt).hash);
            expect(response.payload).toStrictEqual<Patch.Ok.Updated>({
                ok: true,
                updated: ['password']
            });

            done();
        });
        it('should update screenname in database and return updates', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();
            const updatedScreenname = 'Tha';
            mock.request.body.screenname = updatedScreenname;

            const response = await mock.runRouteHandler(patchUser, { username: user.username });
            expect(mock.users.updateManySpy).toBeCalledWith({ _id: user._id }, { $set: { screenname: updatedScreenname } });
            expect(mock.users.data).toContainEqual(expect.objectContaining({
                _id: user._id,
                screenname: updatedScreenname
            }));
            expect(response.payload).toStrictEqual<Patch.Ok.Updated>({
                ok: true,
                updated: ['screenname']
            });

            done();
        });
    });
});
