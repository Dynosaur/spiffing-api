import { hash } from 'tools/crypto';
import { DbUser } from 'database/data-types';
import { ObjectId } from 'mongodb';
import { MockEnvironment } from 'tests/mock/mock-environment';
import { INoUserFoundError } from 'app/server/interface/responses/error-responses';
import { IAuthorize, IDeregister, IPatch, IRegister } from 'interface/responses/auth-endpoints';
import { authorize, deregister, patchUser, register } from 'server/router/auth-router';

describe('auth unit tests', () => {
    describe('register', () => {
        it('should check if the user exists already', async done => {
            const mock = new MockEnvironment();
            mock.request.params.id = 'hello';

            await mock.runRouteHandler(register, { password: 'world' });
            expect(mock.users.findSpy).toBeCalledWith({ username: 'hello' });

            done();
        });
        it('should create a user', async done => {
            const mock = new MockEnvironment();
            const username = 'hello';
            const password = 'world';

            await mock.runRouteHandler(register, { username, password });
            expect(mock.users.insertOneSpy).toBeCalled();
            expect(mock.users.data[0]).toStrictEqual<DbUser>({
                _id: expect.any(ObjectId),
                password: {
                    hash: expect.stringMatching(/[a-f\d]{32}/),
                    salt: expect.stringMatching(/[a-f\d]{32}/)
                },
                screenname: username,
                username
            });

            done();
        });
        it('should return ok and the user when created', async done => {
            const mock = new MockEnvironment();
            const username = 'hello';
            const password = 'world';

            const resp = await mock.runRouteHandler(register, { username, password });
            expect(resp.payload).toStrictEqual<IRegister.Success>({
                ok: true,
                user: expect.objectContaining({ username })
            });

            done();
        });
        it('should return an error if the username is taken', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();
            mock.request.params.id = user.username;

            const resp = await mock.runRouteHandler(register);
            expect(mock.users.insertOneSpy).not.toBeCalled();
            expect(resp.payload).toStrictEqual<IRegister.Failed.UserExists>({
                error: 'User Already Exists',
                ok: false
            });

            done();
        });
    });
    describe('authenticate', () => {
        it('should return OK', async done => {
            const mock = new MockEnvironment();

            const resp = await mock.runRouteHandler(authorize);
            expect(resp.payload).toMatchObject<IAuthorize.Success>({ ok: true });
            done();
        });
    });
    describe('deregister', () => {
        it('should return an error if the user does not exist', async done => {
            const mock = new MockEnvironment();
            mock.request.params.id = 'hello';

            const response = await mock.runRouteHandler(deregister);
            expect(mock.users.findSpy).toBeCalledWith({ username: 'hello' });
            expect(response.payload).toStrictEqual<INoUserFoundError>({
                error: 'No User Found',
                id: 'hello',
                ok: false
            });

            done();
        });
        it('should remove the user from the database', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();
            mock.request.params.id = user.username;
            const keepUsers = mock.generateUsers(9);

            await mock.runRouteHandler(deregister);
            expect(mock.users.deleteManySpy).toBeCalledWith({ _id: user._id });
            expect(mock.users.data).not.toContain(user);
            expect(mock.users.data).toEqual(expect.arrayContaining(keepUsers));

            done();
        });
        it('should remove the user\'s posts from the database', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();
            mock.request.params.id = user.username;
            const removePosts = mock.generatePosts(5, user._id);
            const keepPosts = mock.generatePosts(5);

            await mock.runRouteHandler(deregister);
            expect(mock.posts.deleteManySpy).toBeCalledWith({ author: user._id });
            expect(mock.users.data).not.toEqual(expect.arrayContaining(removePosts));
            expect(mock.posts.data).toEqual(expect.arrayContaining(keepPosts));

            done();
        });
        it('should return ok', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();
            mock.request.params.id = user.username;
            mock.generatePosts(3, user._id);

            const response = await mock.runRouteHandler(deregister);
            expect(response.payload).toStrictEqual<IDeregister.Success>({ ok: true });

            done();
        });
    });
    describe('patchUser', () => {
        it('should check that the user exists', async done => {
            const mock = new MockEnvironment();

            const response = await mock.runRouteHandler(patchUser, { username: 'hello' });
            expect(mock.users.findSpy).toBeCalledWith({ username: 'hello' });
            expect(response.payload).toStrictEqual<INoUserFoundError>({
                error: 'No User Found',
                id: null,
                ok: false
            });

            done();
        });
        it('should handle no updates provided', async done => {
            const mock = new MockEnvironment();
            const user = mock.createUser();

            const response = await mock.runRouteHandler(patchUser, { username: user.username });
            expect(mock.users.updateManySpy).not.toBeCalled();
            expect(response.payload).toStrictEqual<IPatch.Success>({
                ok: true,
                updated: [],
                'rejected-props': []
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
            expect(response.payload).toStrictEqual<IPatch.Success>({
                ok: true,
                updated: ['username'],
                'rejected-props': []
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
            expect(response.payload).toStrictEqual<IPatch.Success>({
                ok: true,
                'rejected-props': [],
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
            expect(response.payload).toStrictEqual<IPatch.Success>({
                ok: true,
                'rejected-props': [],
                updated: ['screenname']
            });

            done();
        });
    });
});
