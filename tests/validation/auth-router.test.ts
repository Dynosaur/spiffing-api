import { createRequest, encodeBasicAuth, postJSON } from '../../src/tools';
import { AuthenticateEndpoint, DeregisterEndpoint, PatchEndpoint, RegisterEndpoint } from '../../src/server/interface/responses/auth-endpoints';

function createTestUsername(): string {
    return 'test-user-' + (Math.round(999 * Math.random()) + 1);
}

let username = createTestUsername();
let password = 'test';

function authenticate(): string {
    return encodeBasicAuth(username, password);
}

describe('authentication and authorization', () => {

    describe('register a new user', () => {
        it('should create a new user', async done => {
            const username = 'hello';
            const password = 'world';

            const resp = await postJSON<RegisterEndpoint>(`localhost:3005/api/user/${username}`, null, { Authorization: encodeBasicAuth(username, password) });

            expect(resp).toMatchObject({ status: 'CREATED' });

            done();
        });
    });

    xtest('register a new user', async done => {
        const resp = await createRequest<RegisterEndpoint>('POST', 'localhost:3005/api/user/' + username, 'json', null, { Authorization: authenticate() });
        expect(resp).toMatchObject({ status: 'CREATED' });
        done();
    });

    xtest('authenticate a user', async done => {
        const res = await createRequest<AuthenticateEndpoint>('POST', 'localhost:3005/api/authenticate', 'json', null, { Authorization: authenticate() });
        expect(res).toMatchObject({ status: 'OK' });
        done();
    });

    xdescribe('update user data', () => {
        test('change username', async done => {
            const newUsername = createTestUsername();
            const res = await createRequest<PatchEndpoint>('PATCH', `localhost:3005/api/user/${username}`, 'json', { username: newUsername }, { Authorization: authenticate() });
            username = newUsername;
            expect(res).toMatchObject({ status: 'UPDATED' });
            done();
        });
        test('change password', async done => {
            const newPassword = 'world';
            const res = await createRequest<PatchEndpoint>('PATCH', `localhost:3005/api/user/${username}`, 'json', { password: newPassword }, { Authorization: authenticate() });
            password = newPassword;
            expect(res).toMatchObject({ status: 'UPDATED' });
            done();
        });
        test('change username and password', async done => {
            const newUsername = createTestUsername();
            const newPassword = (Math.round(999 * Math.random()) + 1).toString();
            const res = await createRequest<PatchEndpoint>(
                'PATCH',
                `localhost:3005/api/user/${username}`,
                'json',
                { username: newUsername, password: newPassword },
                { Authorization: authenticate() }
            );
                username = newUsername;
                password = newPassword;
            expect(res).toMatchObject({ status: 'UPDATED' });
            done();
        });
    });

    xtest('delete a user', () => {
        return createRequest<DeregisterEndpoint>('DELETE', 'localhost:3005/api/user/' + username, 'json', null, { Authorization: authenticate() }).then(res => {
            expect(res).toMatchObject({ status: 'DELETED' });
        });
    });

});
