import { IGetUsers, getUser } from 'router/user/get';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { UserWrapper } from 'database/user/wrapper';

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
        const response = await env.executeRouteHandler(getUser);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            'allowed-queries': ['id'],
            ok: true,
            users: [users[0].toInterface()]
        });
        done();
    });
    it('should find a user by their username', async done => {
        env.request.query.username = users[1].username;
        const response = await env.executeRouteHandler(getUser);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            'allowed-queries': ['username'],
            ok: true,
            users: [users[1].toInterface()]
        });
        done();
    });
    it('should find multiple users by their ids', async done => {
        env.request.query.ids = [users[2].id, users[3].id, users[4].id].join(',');
        const response = await env.executeRouteHandler(getUser);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            'allowed-queries': ['ids'],
            ok: true,
            users: [users[2], users[3], users[4]].map(user => user.toInterface())
        });
        done();
    });
    it('should find multiple users by their usernames', async done => {
        env.request.query.usernames = [users[1].username, users[2].username].join(',');
        const response = await env.executeRouteHandler(getUser);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            'allowed-queries': ['usernames'],
            ok: true,
            users: [users[1], users[2]].map(user => user.toInterface())
        });
        done();
    });
});
