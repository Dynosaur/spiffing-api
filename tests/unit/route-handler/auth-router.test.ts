import { createMocks, fillPosts, fillUsers, runRouteHandler } from '../../tools';
import { authenticate, deregister, patchUser, register } from '../../../src/server/router/auth-router';
import { MockUser } from '../../mock';

describe('auth unit tests', () => {
    describe('register', () => {
        test('should create a user', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = createMocks();
            mock.req.params.username = username;

            const resp = await runRouteHandler(register, mock, { username, password });
            expect(resp.payload).toStrictEqual({ status: 'CREATED' });
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(mock.users.insertOneSpy).toBeCalledWith(expect.objectContaining({ username, password, screenName: username }));

            done();
        });
        test('should not create a user when "test" query param is present', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = createMocks();
            mock.req.query.test = true;
            mock.req.params.username = username;

            const resp = await runRouteHandler(register, mock, { username, password });
            expect(resp.payload).toStrictEqual({ status: 'TEST_OK' });
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(mock.users.insertOneSpy).not.toBeCalled();

            done();
        });
        test('should return an error when the username is taken', async done => {
            const username = 'hello';

            const mock = createMocks();
            mock.users.data.push(new MockUser(null, null, username));
            mock.req.params.username = username;

            const resp = await runRouteHandler(register, mock, { username });
            expect(resp.payload).toStrictEqual({ status: 'E_USER_EXISTS' });
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(mock.users.insertOneSpy).not.toBeCalled();

            done();
        });
    });
    describe('authenticate', () => {
        test('should return OK', async done => {
            const mock = createMocks();

            const resp = await runRouteHandler(authenticate, mock);
            expect(resp.payload).toMatchObject({ status: 'OK' });
            done();
        });
    });
    describe('deregister', () => {
        test('should delete the user and its posts', async done => {
            const user = new MockUser();
            const userPosts = fillPosts(3, user.username);
            const numOfOtherUsers = 4;
            const numOfOtherPosts = 7;

            const mock = createMocks(numOfOtherUsers, numOfOtherPosts);
            mock.users.data.push(user);
            mock.posts.data.push(...userPosts);

            const resp = await runRouteHandler(deregister, mock, { username: user.username });
            expect(resp.payload).toStrictEqual({ status: 'DELETED' });
            expect(mock.users.deleteManySpy).toBeCalledWith({ username: user.username });
            expect(mock.posts.deleteManySpy).toBeCalledWith({ author: user.username });
            expect(mock.users.data).not.toContain(user);
            expect(mock.users.data.length).toBe(numOfOtherUsers);
            expect(mock.posts.data).not.toEqual(expect.arrayContaining(userPosts));
            expect(mock.posts.data.length).toBe(numOfOtherPosts);

            done();
        });
        test('should return a internal error response when database actions fail', async done => {
            const user = new MockUser();
            const userPosts = fillPosts(5, user.username);

            const mock = createMocks(4, 5);
            mock.users.data.push(user);
            mock.posts.data.push(...userPosts);
            mock.users.forceDeleteMany = false;
            mock.posts.forceDeleteMany = false;

            let resp = await runRouteHandler(deregister, mock, { username: user.username });
            expect(resp.payload).toMatchObject({ status: 'E_INTERNAL' });
            expect(mock.users.data).toContain(user);

            mock.users.forceDeleteMany = true;
            resp = await runRouteHandler(deregister, mock, { username: user.username });
            expect(resp.payload).toMatchObject({ status: 'E_INTERNAL' });
            expect(mock.posts.data).toEqual(expect.arrayContaining(userPosts));

            mock.posts.forceDeleteMany = true;
            resp = await runRouteHandler(deregister, mock, { username: user.username });
            expect(resp.payload).toStrictEqual({ status: 'DELETED' });
            expect(mock.users.data).not.toContain(user);
            expect(mock.posts.data).not.toEqual(expect.arrayContaining(userPosts));

            done();
        });
    });
    describe('patchUser', () => {
        test('should update username', async done => {
            const newUsername = 'new-username';

            const mock = createMocks(1);
            mock.req.body.username = newUsername;

            const oldUsername = mock.users.data[0].username;

            const resp = await runRouteHandler(patchUser, mock, { username: oldUsername });
            expect(resp.payload).toStrictEqual({ status: 'UPDATED', updated: ['username'] });
            expect(mock.users.updateManySpy).toBeCalledWith({ username: oldUsername }, { $set: { username: newUsername } });
            expect(mock.users.data[0].username).toBe(newUsername);

            done();
        });
        test('should update password', async done => {
            const password = 'new_password';

            const mock = createMocks(1);
            mock.req.body.password = password;

            const username = mock.users.data[0].username;

            const resp = await runRouteHandler(patchUser, mock, { username });
            expect(resp.payload).toStrictEqual({ status: 'UPDATED', updated: ['password'] });
            expect(mock.users.updateManySpy).toBeCalledWith({ username }, { $set: { password } });
            expect(mock.users.data[0].password).toBe(password);

            done();
        });
        test('should update username and password', async done => {
            const mock = createMocks(1);
            mock.req.body.username = 'new-username';
            mock.req.body.password = 'new-password';

            const username = mock.users.data[0].username;

            const resp = await runRouteHandler(patchUser, mock, { username });
            expect(resp.payload).toStrictEqual({ status: 'UPDATED', updated: ['username', 'password'] });
            expect(mock.users.updateManySpy).toBeCalledTimes(2);

            done();
        });
        test('should update username in user\'s post', async done => {
            const newUsername = 'new-username';

            const mock = createMocks(1);
            mock.req.body.username = newUsername;

            const oldUsername = mock.users.data[0].username;
            mock.posts.data.push(...fillPosts(4, oldUsername));

            const resp = await runRouteHandler(patchUser, mock, { username: oldUsername });
            expect(resp.payload).toStrictEqual({ status: 'UPDATED', updated: ['username'] });
            expect(mock.users.updateManySpy).toBeCalledWith({ username: oldUsername }, { $set: { username: newUsername } });
            expect(mock.posts.updateManySpy).toBeCalledWith({ author: oldUsername }, { $set: { author: newUsername } });
            expect(mock.users.data[0].username).toBe(newUsername);
            mock.posts.data.forEach(post => expect(post.author).toBe(newUsername));

            done();
        });
    });
});
