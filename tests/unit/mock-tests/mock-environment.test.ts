import { ObjectId } from 'mongodb';
import { DbPost, DbUser } from 'app/database/data-types';
import { MockEnvironment } from 'tests/mock/mock-environment';

describe('mock-environment', () => {
    describe('collections', () => {
        it('should prefill collections with mock data if specified', () => {
            const mock = new MockEnvironment({ postFill: 5, userFill: 5 });

            expect(mock.users.data).toStrictEqual(
                expect.arrayContaining([
                    expect.objectContaining<DbUser>({
                        _id: expect.any(ObjectId),
                        password: {
                            hash: expect.stringMatching(/[a-f\d]+/),
                            salt: expect.stringMatching(/[a-f\d]+/)
                        },
                        screenname: expect.stringMatching(/test-user-\d+/),
                        username: expect.stringMatching(/test-user-\d+/),
                    })
                ])
            );
            expect(mock.posts.data).toStrictEqual<DbPost>(
                expect.arrayContaining([
                    expect.objectContaining<DbPost>({
                        _id: expect.any(ObjectId),
                        author: expect.any(ObjectId),
                        comments: [],
                        content: MockEnvironment.defaultContent,
                        dislikes: 0,
                        likes: 0,
                        title: MockEnvironment.defaultTitle
                    })
                ])
            );
        });
        it('should be able to use actions', async done => {
            const mock = new MockEnvironment();
            const users = mock.generateUsers(100);

            for (const user of users) expect(await mock.actions.user.readUser({ _id: user._id })).toMatchObject({ ...user });
            const user = users[0];
            await mock.actions.user.updateUser(user._id.toHexString(), { username: 'hello' });
            expect(user.username).toBe('hello');
            await mock.actions.user.deleteUser(user._id);
            expect(mock.users.data).not.toContain(user);

            done();
        });
    });
    it('should create a user', () => {
        const mock = new MockEnvironment();
        const user = mock.createUser();

        expect(mock.users.data[0]).toStrictEqual(user);
    });
    it('should generate many users', () => {
        const mock = new MockEnvironment();
        const users = mock.generateUsers(3);

        expect(mock.users.data).toStrictEqual(expect.arrayContaining(users));
    });
});
