import { routes } from '../../src/server/router/auth-router';
import { MockEnvironment } from '../mock';
import { encodeBasicAuth, hash } from '../../src/tools';
import { AuthenticateEndpoint, DeregisterEndpoint, PatchEndpoint, RegisterEndpoint } from '../../src/server/interface/responses/auth-endpoints';

const register = routes[0];
const authenticate = routes[1];
const deregister = routes[2];
const patch = routes[3];

describe('auth route handlers integration', () => {
    describe('register', () => {
        it('should create a user', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment<RegisterEndpoint>();
            mock.request.headers.authorization = encodeBasicAuth(username, password);
            mock.request.params.username = username;

            await mock.integration(register.handler, register.requirements);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(mock.users.insertOneSpy).toBeCalledWith(expect.objectContaining({ username }));
            expect(mock.users.data).toContainEqual(expect.objectContaining({ username }));
            expect(resp).toMatchObject({ status: 'CREATED' });

            done();
        });
        it('should not create a user if the username is taken', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment<RegisterEndpoint>();
            mock.createUser(username);
            mock.request.headers.authorization = encodeBasicAuth(username, password);
            mock.request.params.username = username;

            await mock.integration(register.handler, register.requirements);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(mock.users.insertOneSpy).not.toBeCalled();
            expect(resp).toMatchObject({ status: 'E_USER_EXISTS' });

            done();
        });
        it('should not create a user if the test qparam is provided', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment<RegisterEndpoint>();
            mock.request.headers.authorization = encodeBasicAuth(username, password);
            mock.request.params.username = username;
            mock.request.query.test = true;

            await mock.integration(register.handler, register.requirements);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.insertOneSpy).not.toBeCalled();
            expect(resp).toMatchObject({ status: 'TEST_OK' });

            done();
        });
    });
    describe('authenticate', () => {
        it('should return OK if the credentials are correct', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment<AuthenticateEndpoint>();
            mock.createUser(username, password);
            mock.request.headers.authorization = encodeBasicAuth(username, password);

            await mock.integration(authenticate.handler, authenticate.requirements);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(resp).toStrictEqual({ status: 'OK' });

            done();
        });
        it('should return FAILED if the credentials are incorrect', async done => {
            const username = 'hello';

            const mock = new MockEnvironment<AuthenticateEndpoint>();
            mock.createUser(username, 'password');
            mock.request.headers.authorization = encodeBasicAuth(username, 'world');

            await mock.integration(authenticate.handler, authenticate.requirements);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(resp).toStrictEqual({ status: 'E_AUTH_FAILED' });

            done();
        });
        it('should return NO_USER if the user does not exist', async done => {
            const mock = new MockEnvironment<AuthenticateEndpoint>();
            mock.request.headers.authorization = encodeBasicAuth('hello', 'world');

            await mock.integration(authenticate.handler, authenticate.requirements);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.findSpy).toBeCalledWith({ username: 'hello' });
            expect(resp).toStrictEqual({ status: 'E_AUTH_NO_USER' });

            done();
        });
    });
    describe('deregister', () => {
        it('should remove the account and all of its posts', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment<DeregisterEndpoint>();
            mock.createUser(username, password);
            mock.generatePosts(5, username);
            mock.request.params.username = username;
            mock.request.headers.authorization = encodeBasicAuth(username, password);

            await mock.integration(deregister.handler, deregister.requirements);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.data.length).toBe(0);
            expect(mock.posts.data.length).toBe(0);
            expect(resp).toStrictEqual({ status: 'DELETED' });

            done();
        });
        it('should not take action if credentials are incorrect', async done => {
            const mock = new MockEnvironment<DeregisterEndpoint>();
            mock.createUser('hello', 'world');
            mock.generatePosts(5, 'hello');
            mock.request.params.username = 'hello';
            mock.request.headers.authorization = encodeBasicAuth('hello', 'password');

            await mock.integration(deregister.handler, deregister.requirements);
            const resp = mock.request.res.internalResponse;
            expect(mock.users.data.length).toBe(1);
            expect(mock.posts.data.length).toBe(5);
            expect(resp).toStrictEqual({ status: 'E_AUTH_FAILED' });

            done();
        });
        it('should return NO_USER if the user does not exist', async done => {
            const mock = new MockEnvironment<DeregisterEndpoint>();
            mock.request.params.username = 'hello';
            mock.request.headers.authorization = encodeBasicAuth('hello', 'world');

            await mock.integration(deregister.handler, deregister.requirements);
            const resp = mock.request.res.internalResponse;
            expect(resp).toStrictEqual({ status: 'E_AUTH_NO_USER' });

            done();
        });
    });
    describe('patch', () => {
        it('should update username', async done => {
            const oldUsername = 'old-username';
            const password = 'world';
            const newUsername = 'new-username';
            const mock = new MockEnvironment<PatchEndpoint>();
            const user = mock.createUser(oldUsername, password);
            mock.request.body.username = newUsername;
            mock.request.headers.authorization = encodeBasicAuth(oldUsername, password);
            mock.request.params.username = oldUsername;

            await mock.integration(patch.handler, patch.requirements);
            const resp = mock.request.res.internalResponse;
            expect(user.username).toBe(newUsername);
            expect(resp).toStrictEqual({ status: 'UPDATED', updated: ['username'] });

            done();
        });
        it('should update password', async done => {
            const username = 'hello';
            const password = 'world';
            const mock = new MockEnvironment<PatchEndpoint>();
            const user = mock.createUser(username, password);
            mock.request.body.password = 'secure-password';
            mock.request.headers.authorization = encodeBasicAuth(username, password);
            mock.request.params.username = username;

            await mock.integration(patch.handler, patch.requirements);
            const resp = mock.request.res.internalResponse;
            expect(mock.actions.cipher.decrypt(user.password.hash)).toBe(hash('secure-password', user.password.salt).hash);
            expect(resp).toStrictEqual({ status: 'UPDATED', updated: ['password'] });

            done();
        });
    });
});
