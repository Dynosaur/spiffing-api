import { routes } from '../../src/server/router/auth-router';
import { MockUser } from '../mock';
import { createMocks } from '../mock/integration';
import { encodeBasicAuth } from '../../src/tools';
import { RegisterEndpoint } from '../../src/server/interface/responses/auth-endpoints';
import { runExecuteRouteHandler } from '../mock/integration/mock';

const register = routes[0];

describe('auth routes integration', () => {
    describe('register', () => {
        it('should create a user', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = createMocks<RegisterEndpoint>();
            mock.req.headers.authorization = encodeBasicAuth(username, password);
            mock.req.params.username = username;

            await runExecuteRouteHandler(mock, register);
            const resp = mock.req.res.internalResponse;
            expect(resp).toMatchObject({ payload: { status: 'CREATED' } });
            expect(mock.users.insertOneSpy).toBeCalledWith(expect.objectContaining({ username, password }));
            expect(mock.users.data).toContainEqual(expect.objectContaining({ username, password }));
            expect(mock.users.findSpy).toBeCalledWith({ username });

            done();
        });
        it('should not create a user if the username is taken', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = createMocks<RegisterEndpoint>();
            mock.users.data.push(new MockUser(username));
            mock.req.headers.authorization = encodeBasicAuth(username, password);
            mock.req.params.username = username;

            await runExecuteRouteHandler(mock, register);
            const resp = mock.req.res.internalResponse;
            expect(resp).toMatchObject({ payload: { status: 'E_USER_EXISTS' } });
            expect(mock.users.insertOneSpy).not.toBeCalled();
            expect(mock.users.findSpy).toBeCalledWith({ username });

            done();
        });
        it('should not create a user if the test qparam is provided', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = createMocks<RegisterEndpoint>();
            mock.req.headers.authorization = encodeBasicAuth(username, password);
            mock.req.params.username = username;
            mock.req.query.test = true;

            await runExecuteRouteHandler(mock, register);
            const resp = mock.req.res.internalResponse;
            expect(resp).toMatchObject({ payload: { status: 'TEST_OK' } });
            expect(mock.users.insertOneSpy).not.toBeCalled();

            done();
        });
    });
});
