import { hash } from 'tools/crypto';
import { ObjectId } from 'mongodb';
import { DbPost, DbUser } from 'database/data-types';
import { encodeBasicAuth } from 'tools/auth';
import { MockEnvironment } from 'tests/mock/mock-environment';
import { authorize, deregister, patchUser, register } from 'server/router/auth-router';
import { IAuthorize, IDeregister, IPatch, IRegister } from 'interface/responses/auth-endpoints';
import { IAuthorizationParseError, IUnauthenticatedError, IUnauthorizedError } from 'interface/responses/error-responses';

describe('auth unit tests', () => {
    let mock: MockEnvironment<any>;
    beforeEach(() => {
        mock = new MockEnvironment();
    });
    describe('register', () => {
        it('should not create a user if one already exists', async done => {
            const username = 'hello';
            mock.createUser(username);
            mock.request.headers.authorization = encodeBasicAuth(username, 'world');
            mock.request.params.id = 'hello';

            const response = await mock.runRouteHandler(register);
            expect(response.payload).toStrictEqual<IRegister.Failed.UserExists>({
                error: 'User Already Exists',
                ok: false
            });
            expect(mock.users.findSpy).toBeCalledWith({ username: 'hello' });

            done();
        });
        it('should create a user', async done => {
            const username = 'hello';
            mock.request.headers.authorization = encodeBasicAuth(username, 'world');

            const response = await mock.runRouteHandler(register);
            expect(response.payload).toStrictEqual<IRegister.Success>({
                ok: true,
                user: {
                    _id: expect.stringMatching(/[a-f\d]{24}/),
                    created: expect.any(Number),
                    screenname: username,
                    username
                }
            });
            expect(mock.users.data[0]).toStrictEqual<DbUser>({
                _id: expect.any(ObjectId),
                password: {
                    hash: expect.stringMatching(/[a-f\d]{32}/),
                    salt: expect.stringMatching(/[a-f\d]{32}/)
                },
                screenname: username,
                username
            });
            expect(mock.users.insertOneSpy).toBeCalled();

            done();
        });
    });
    describe('authorize', () => {
        it('should authorize', async done => {
            const user = mock.createUser();
            mock.request.headers.authorization = encodeBasicAuth(user.username, MockEnvironment.defaultPassword);
            mock.request.params.id = user._id.toHexString();

            const resp = await mock.runRouteHandler(authorize);
            expect(resp.payload).toStrictEqual<IAuthorize.Success>({ ok: true });
            done();
        });
    });
    describe('deregister', () => {
        let user: DbUser;
        let userPosts: DbPost[];
        beforeEach(() => {
            user = mock.createUser();
            userPosts = mock.generatePosts(3, user._id);
            mock.request.headers.authorization = encodeBasicAuth(user.username, MockEnvironment.defaultPassword);
            mock.request.params.id = user._id.toHexString();
        });
        it('should require authentication', async done => {
            delete mock.request.headers.authorization;
            const response = await mock.runRouteHandler(deregister);
            expect(response.payload).toStrictEqual<IUnauthenticatedError>({
                error: 'Unauthenticated',
                ok: false
            });
            done();
        });
        it('should require authorization', async done => {
            mock.request.headers.authorization = encodeBasicAuth('hello', 'world');
            const response = await mock.runRouteHandler(deregister);
            expect(response.payload).toStrictEqual<IUnauthorizedError>({
                error: 'Unauthorized',
                ok: false
            });
            done();
        });
        it('should return an error if the authorization header cannot be parsed', async done => {
            mock.request.headers.authorization = 'lol';
            let response = await mock.runRouteHandler(deregister);
            expect(response.payload).toStrictEqual<IAuthorizationParseError>({
                error: 'Authorization Parsing Error',
                ok: false,
                part: 'Authorization Type'
            });
            mock.request.headers.authorization = encodeBasicAuth('', '');
            response = await mock.runRouteHandler(deregister);
            expect(response.payload).toStrictEqual<IAuthorizationParseError>({
                error: 'Authorization Parsing Error',
                ok: false,
                part: 'Username'
            });
            mock.request.headers.authorization = encodeBasicAuth('hello', '');
            response = await mock.runRouteHandler(deregister);
            expect(response.payload).toStrictEqual<IAuthorizationParseError>({
                error: 'Authorization Parsing Error',
                ok: false,
                part: 'Password'
            });
            done();
        });
        it('should return ok', async done => {
            const response = await mock.runRouteHandler(deregister);
            expect(response.payload).toStrictEqual<IDeregister.Success>({ ok: true });
            expect(mock.users.deleteManySpy).toBeCalledWith({ _id: user._id });
            expect(mock.users.data.length).toBe(0);
            expect(mock.posts.deleteManySpy).toBeCalledWith({ author: user._id });
            expect(mock.posts.data.length).toBe(0);
            done();
        });
    });
    describe('patchUser', () => {
        let user: DbUser;
        beforeEach(() => {
            user = mock.createUser();
            mock.request.headers.authorization = encodeBasicAuth(user.username, MockEnvironment.defaultPassword);
            mock.request.params.id = user._id.toHexString();
        });
        it('should require authentication', async done => {
            delete mock.request.headers.authorization;

            const response = await mock.runRouteHandler(patchUser);
            expect(response.payload).toStrictEqual<IUnauthenticatedError>({
                error: 'Unauthenticated',
                ok: false
            });
            done();
        });
        it('should require authorization', async done => {
            mock.request.headers.authorization = encodeBasicAuth('hello', 'world');

            const response = await mock.runRouteHandler(patchUser);
            expect(response.payload).toStrictEqual<IUnauthorizedError>({
                error: 'Unauthorized',
                ok: false
            });
            expect(mock.users.findSpy).toBeCalledWith({ username: 'hello' });

            done();
        });
        it('should handle no updates provided', async done => {
            const response = await mock.runRouteHandler(patchUser);
            expect(response.payload).toStrictEqual<IPatch.Success>({
                ok: true,
                updated: [],
                'rejected-props': []
            });
            expect(mock.users.updateManySpy).not.toBeCalled();

            done();
        });
        it('should update username in database and return updates', async done => {
            const updatedUsername = 'Ghost Bath';
            mock.request.body.username = updatedUsername;

            const response = await mock.runRouteHandler(patchUser);
            expect(response.payload).toStrictEqual<IPatch.Success>({
                ok: true,
                updated: ['username'],
                'rejected-props': []
            });
            expect(mock.users.updateManySpy).toBeCalledWith({ _id: user._id }, { $set: { username: updatedUsername } });
            expect(mock.users.data).toContainEqual(expect.objectContaining({
                _id: user._id,
                username: updatedUsername
            }));

            done();
        });
        it('should update password in database and return updates', async done => {
            const newPassword = 'F4%43!&';
            mock.request.body.password = newPassword;

            const response = await mock.runRouteHandler(patchUser);
            expect(response.payload).toStrictEqual<IPatch.Success>({
                ok: true,
                'rejected-props': [],
                updated: ['password']
            });
            const dbUser = mock.users.data[0];
            expect(mock.users.updateManySpy).toBeCalledWith({ _id: user._id }, { $set: { password: {
                hash: expect.stringMatching(/[a-f\d]{32}/),
                salt: expect.stringMatching(/[a-f\d]{32}/)
            } } });
            expect(mock.commonActions.cipher.decrypt(dbUser.password.hash)).toBe(hash(newPassword, dbUser.password.salt).hash);

            done();
        });
        it('should update screenname in database and return updates', async done => {
            const updatedScreenname = 'Tha';
            mock.request.body.screenname = updatedScreenname;

            const response = await mock.runRouteHandler(patchUser);
            expect(response.payload).toStrictEqual<IPatch.Success>({
                ok: true,
                'rejected-props': [],
                updated: ['screenname']
            });
            expect(mock.users.updateManySpy).toBeCalledWith({ _id: user._id }, { $set: { screenname: updatedScreenname } });
            expect(mock.users.data).toContainEqual(expect.objectContaining({
                _id: user._id,
                screenname: updatedScreenname
            }));

            done();
        });
    });
});
