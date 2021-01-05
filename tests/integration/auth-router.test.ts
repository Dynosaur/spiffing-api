import { hash } from 'tools/crypto';
import { routes } from 'server/router/auth-router';
import { convertDbUser } from 'database/data-types';
import { MockEnvironment } from 'tests/mock';
import { encodeBasicAuth } from 'tools/auth';
import { IUnauthorizedError } from 'app/server/interface/responses/error-responses';
import { IAuthorize, IDeregister, IPatch, IRegister } from 'interface/responses/auth-endpoints';

const register = routes[0];
const authenticate = routes[1];
const deregister = routes[2];
const patch = routes[3];

describe('auth route handlers integration', () => {
    describe('register', () => {
        it('should create a user', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment<IRegister.Tx>();
            mock.request.headers.authorization = encodeBasicAuth(username, password);
            mock.request.params.username = username;

            await mock.integration(register.handler);
            const response = mock.request.res.internalResponse;
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(mock.users.insertOneSpy).toBeCalledWith(expect.objectContaining({ username }));
            expect(mock.users.data).toContainEqual(expect.objectContaining({ username }));
            expect(response).toStrictEqual<IRegister.Success>({
                ok: true,
                user: convertDbUser(mock.users.data[0])
            });

            done();
        });
        it('should not create a user if the username is taken', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment<IRegister.Tx>();
            mock.createUser(username);
            mock.request.headers.authorization = encodeBasicAuth(username, password);
            mock.request.params.id = username;

            await mock.integration(register.handler);
            const response = mock.request.res.internalResponse;
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(mock.users.insertOneSpy).not.toBeCalled();
            expect(response).toStrictEqual<IRegister.Failed.UserExists>({
                error: 'User Already Exists',
                ok: false
            });

            done();
        });
    });
    describe('authenticate', () => {
        it('should return OK if the credentials are correct', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment<IAuthorize.Tx>();
            mock.createUser(username, password);
            mock.request.headers.authorization = encodeBasicAuth(username, password);

            await mock.integration(authenticate.handler);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(resp).toStrictEqual<IAuthorize.Success>({
                ok: true
            });

            done();
        });
        it('should return FAILED if the credentials are incorrect', async done => {
            const username = 'hello';

            const mock = new MockEnvironment<IAuthorize.Tx>();
            mock.createUser(username, 'password');
            mock.request.headers.authorization = encodeBasicAuth(username, 'world');

            await mock.integration(authenticate.handler);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(resp).toStrictEqual<IAuthorize.ErrTx>({
                error: 'Unauthorized',
                ok: false
            });

            done();
        });
        it('should return NO_USER if the user does not exist', async done => {
            const mock = new MockEnvironment<IAuthorize.Tx>();
            mock.request.headers.authorization = encodeBasicAuth('hello', 'world');

            await mock.integration(authenticate.handler);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.findSpy).toBeCalledWith({ username: 'hello' });
            expect(resp).toStrictEqual<IAuthorize.ErrTx>({
                error: 'Unauthorized',
                ok: false
            });

            done();
        });
    });
    describe('deregister', () => {
        it('should remove the account and all of its posts', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment<IDeregister.Tx>();
            const user = mock.createUser(username, password);
            mock.generatePosts(5, user._id);
            mock.request.params.id = username;
            mock.request.headers.authorization = encodeBasicAuth(username, password);

            await mock.integration(deregister.handler);
            const response = mock.request.res.internalResponse;
            expect(mock.users.data.length).toBe(0);
            expect(mock.posts.data.length).toBe(0);
            expect(response).toStrictEqual<IDeregister.Success>({ ok: true });

            done();
        });
        it('should not take action if credentials are incorrect', async done => {
            const mock = new MockEnvironment<IDeregister.Tx>();
            const user = mock.createUser('hello', 'world');
            mock.generatePosts(5, user._id);
            mock.request.params.username = 'hello';
            mock.request.headers.authorization = encodeBasicAuth('hello', 'password');

            await mock.integration(deregister.handler);
            const response = mock.request.res.internalResponse;
            expect(mock.users.data.length).toBe(1);
            expect(mock.posts.data.length).toBe(5);
            expect(response).toStrictEqual<IUnauthorizedError>({
                error: 'Unauthorized',
                ok: false
            });

            done();
        });
        it('should return NO_USER if the user does not exist', async done => {
            const mock = new MockEnvironment<IDeregister.Tx>();
            mock.request.params.username = 'hello';
            mock.request.headers.authorization = encodeBasicAuth('hello', 'world');

            await mock.integration(deregister.handler);
            const response = mock.request.res.internalResponse;
            expect(response).toStrictEqual<IUnauthorizedError>({
                error: 'Unauthorized',
                ok: false
            });

            done();
        });
    });
    describe('patch', () => {
        it('should update username', async done => {
            const oldUsername = 'old-username';
            const password = 'world';
            const newUsername = 'new-username';
            const mock = new MockEnvironment<IPatch.Tx>();
            const user = mock.createUser(oldUsername, password);
            mock.request.body.username = newUsername;
            mock.request.headers.authorization = encodeBasicAuth(oldUsername, password);
            mock.request.params.username = oldUsername;

            await mock.integration(patch.handler);
            const resp = mock.request.res.internalResponse;
            expect(user.username).toBe(newUsername);
            expect(resp).toStrictEqual<IPatch.Success>({
                ok: true,
                updated: ['username'],
                'rejected-props': []
            });

            done();
        });
        it('should update password', async done => {
            const username = 'hello';
            const password = 'world';
            const mock = new MockEnvironment<IPatch.Tx>();
            const user = mock.createUser(username, password);
            mock.request.body.password = 'secure-password';
            mock.request.headers.authorization = encodeBasicAuth(username, password);
            mock.request.params.username = username;

            await mock.integration(patch.handler);
            const resp = mock.request.res.internalResponse;
            expect(mock.commonActions.cipher.decrypt(user.password.hash)).toBe(hash('secure-password', user.password.salt).hash);
            expect(resp).toStrictEqual<IPatch.Success>({
                ok: true,
                updated: ['password'],
                'rejected-props': []
            });

            done();
        });
    });
});
