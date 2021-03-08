import { UserWrapper }            from 'database/user/wrapper';
import { IGetUsers }              from 'interface/responses/api-responses';
import { getUsers }               from 'router/api-router';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';

describe('get-users route handler', () => {
    let env: IntegrationEnvironment;
    let users: UserWrapper[];
    beforeEach(async done => {
        env = new IntegrationEnvironment('get-users');
        await env.initialize();
        users = await env.generateUsers(5);
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    it('should find a user by their id', async done => {
        env.request.query.id = users[0].id;
        const response = await env.executeRouteHandler(getUsers);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            ok: true,
            users: [users[0].toInterface()],
            'allowed-queries': ['id']
        });
        done();
    });
    it('should find a user by their username', async done => {
        env.request.query.username = users[1].username;
        const response = await env.executeRouteHandler(getUsers);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            ok: true,
            users: [users[1].toInterface()],
            'allowed-queries': ['username']
        });
        done();
    });
    it('should find multiple users by their ids', async done => {
        env.request.query.ids = [users[2].id, users[3].id, users[4].id].join(',');
        const response = await env.executeRouteHandler(getUsers);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            ok: true,
            users: [users[2], users[3], users[4]].map(user => user.toInterface()),
            'allowed-queries': ['ids']
        });
        done();
    });
    it('should find multiple users by their usernames', async done => {
        env.request.query.usernames = [users[1].username, users[2].username].join(',');
        const response = await env.executeRouteHandler(getUsers);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            ok: true,
            users: [users[1], users[2]].map(user => user.toInterface()),
            'allowed-queries': ['usernames']
        });
        done();
    });
});
