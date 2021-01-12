import { ObjectId } from 'mongodb';
import { getUsers } from 'router/api-router';
import { IGetUsers } from 'interface/responses/api-responses';
import { MockEnvironment } from 'tests/mock';
import { IMissingDataError } from 'interface/responses/error-responses';
import { convertDbUser, DbUser } from 'database/data-types';

describe('getUsers route handler', () => {
    let mock: MockEnvironment<any>;
    let users: DbUser[];
    beforeEach(() => {
        mock = new MockEnvironment();
        users = mock.generateUsers(5);
    });
    it('should require query params', async done => {
        const response = await mock.runRouteHandler(getUsers);
        expect(response.payload).toStrictEqual<IMissingDataError>({
            error: 'Missing Data',
            missing: {
                received: [],
                required: ['ids'],
                'scope-name': 'query'
            },
            ok: false
        });
        done();
    });
    it('should return requested users', async done => {
        mock.request.query.ids = users[0]._id.toHexString();
        let response = await mock.runRouteHandler(getUsers);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            missing: [],
            ok: true,
            users: [{
                _id: users[0]._id.toHexString(),
                created: expect.any(Number),
                screenname: users[0].screenname,
                username: users[0].username
            }]
        });
        mock.request.query.ids = users.map(user => user._id.toHexString()).join(',');
        response = await mock.runRouteHandler(getUsers);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            missing: [],
            ok: true,
            users: users.map(user => convertDbUser(user))
        });
        done();
    });
    it('should return ids that were not found', async done => {
        const unknownUid = new ObjectId().toHexString();
        mock.request.query.ids = users[0]._id.toHexString() + ',' + unknownUid;
        let response = await mock.runRouteHandler(getUsers);
        expect(response.payload).toStrictEqual<IGetUsers.Success>({
            missing: [unknownUid],
            ok: true,
            users: [convertDbUser(users[0])]
        });
        done();
    });
});
