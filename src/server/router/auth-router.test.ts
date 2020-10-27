import { createRequest, encodeBasicAuth } from '../../tools';
import { AuthenticateEndpoint, DeregisterEndpoint, PatchEndpoint, RegisterEndpoint } from '../interface/responses/auth-endpoints';

function createTestUsername(): string {
    return 'test-user-' + (Math.round(999 * Math.random()) + 1);
}

let username = createTestUsername();
let password = 'test';

function authenticate(): string {
    return encodeBasicAuth(username, password);
}

describe('authentication and authorization', () => {

    test('register a new user', async done => {
        const resp = await createRequest<RegisterEndpoint>('POST', 'localhost:3005/api/user/' + username, 'json', null, { Authorization: authenticate() });
        expect(resp).toMatchObject({ status: 'CREATED' });
        done();
    });

    test('authenticate a user', async done => {
        const res = await createRequest<AuthenticateEndpoint>('POST', 'localhost:3005/api/authenticate', 'json', null, { Authorization: authenticate() });
        expect(res).toMatchObject({ status: 'OK' });
        done();
    });

    describe('update user data', () => {
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

    test('delete a user', () => {
        return createRequest<DeregisterEndpoint>('DELETE', 'localhost:3005/api/user/' + username, 'json', null, { Authorization: authenticate() }).then(res => {
            expect(res).toMatchObject({ status: 'DELETED' });
        });
    });

});
