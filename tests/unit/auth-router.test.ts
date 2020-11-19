import { MockPost } from '../mock';
import { fillArray } from '../tools';
import { MockEnvironment } from '../mock/mock-env';
import { authenticate, deregister, patchUser, register } from '../../src/server/router/auth-router';

describe('auth unit tests', () => {
    describe('register', () => {
        it('should create a user', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment();
            mock.request.params.username = username;

            const resp = await mock.runRouteHandler(register, { username, password });
            expect(resp.payload).toStrictEqual({ status: 'CREATED' });
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(mock.users.insertOneSpy).toBeCalledWith(expect.objectContaining({ username }));

            done();
        });
        it('should not create a user when "test" query param is present', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment();
            mock.request.query.test = true;
            mock.request.params.username = username;

            const resp = await mock.runRouteHandler(register, { username, password });
            expect(mock.users.insertOneSpy).not.toBeCalled();
            expect(resp.payload).toStrictEqual({ status: 'TEST_OK' });

            done();
        });
        it('should respond with error even if "test" query param is present when user already exists', async done => {
            const username = 'hello';
            const password = 'world';

            const mock = new MockEnvironment();
            mock.createUser(username);
            mock.request.query.test = true;
            mock.request.params.username = username;

            const resp = await mock.runRouteHandler(register, { username, password });
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(mock.users.insertOneSpy).not.toBeCalled();
            expect(resp.payload).toStrictEqual({ status: 'E_USER_EXISTS' });

            done();
        });
        it('should return an error when the username is taken', async done => {
            const username = 'hello';

            const mock = new MockEnvironment();
            mock.createUser(username);
            mock.request.params.username = username;

            const resp = await mock.runRouteHandler(register, { username });
            expect(mock.users.findSpy).toBeCalledWith({ username });
            expect(mock.users.insertOneSpy).not.toBeCalled();
            expect(resp.payload).toStrictEqual({ status: 'E_USER_EXISTS' });

            done();
        });
    });
    describe('authenticate', () => {
        it('should return OK', async done => {
            const mock = new MockEnvironment();

            const resp = await mock.runRouteHandler(authenticate);
            expect(resp.payload).toMatchObject({ status: 'OK' });
            done();
        });
    });
    describe('deregister', () => {
        it('should delete the user and its posts', async done => {
            const numOfOtherUsers = 4;
            const numOfOtherPosts = 7;

            const mock = new MockEnvironment({ userFill: numOfOtherUsers, postFill: numOfOtherPosts });
            const user = mock.createUser();
            const userPosts = mock.generatePosts(3, user.username);

            const resp = await mock.runRouteHandler(deregister, { username: user.username });
            expect(resp.payload).toStrictEqual({ status: 'DELETED' });
            expect(mock.users.deleteManySpy).toBeCalledWith({ username: user.username });
            expect(mock.posts.deleteManySpy).toBeCalledWith({ author: user.username });
            expect(mock.users.data).not.toContain(user);
            expect(mock.users.data.length).toBe(numOfOtherUsers);
            expect(mock.posts.data).not.toEqual(expect.arrayContaining(userPosts));
            expect(mock.posts.data.length).toBe(numOfOtherPosts);

            done();
        });
        it('should return a internal error response when database actions fail', async done => {
            const mock = new MockEnvironment({ userFill: 4, postFill: 5 });
            const user = mock.createUser();
            const userPosts = mock.generatePosts(5, user.username);
            mock.users.forceDeleteMany = false;
            mock.posts.forceDeleteMany = false;

            let resp = await mock.runRouteHandler(deregister, { username: user.username });
            expect(resp.payload).toMatchObject({ status: 'E_INTERNAL' });
            expect(mock.users.data).toContain(user);

            mock.users.forceDeleteMany = true;
            resp = await mock.runRouteHandler(deregister, { username: user.username });
            expect(resp.payload).toMatchObject({ status: 'E_INTERNAL' });
            expect(mock.posts.data).toEqual(expect.arrayContaining(userPosts));

            mock.posts.forceDeleteMany = true;
            resp = await mock.runRouteHandler(deregister, { username: user.username });
            expect(resp.payload).toStrictEqual({ status: 'DELETED' });
            expect(mock.users.data).not.toContain(user);
            expect(mock.posts.data).not.toEqual(expect.arrayContaining(userPosts));

            done();
        });
    });
    describe('patchUser', () => {
        it('should update username', async done => {
            const newUsername = 'new-username';

            const mock = new MockEnvironment();
            const user = mock.createUser();
            mock.request.body.username = newUsername;

            const oldUsername = user.username;

            const resp = await mock.runRouteHandler(patchUser, { username: oldUsername });
            expect(resp.payload).toStrictEqual({ status: 'UPDATED', updated: ['username'] });
            expect(mock.users.updateManySpy).toBeCalledWith({ username: oldUsername }, { $set: { username: newUsername } });
            expect(user.username).toBe(newUsername);

            done();
        });
        it('should update password', async done => {
            const password = 'new_password';

            const mock = new MockEnvironment();
            const mockUser = mock.createUser();
            mock.request.body.password = password;

            const username = mockUser.username;
            const oldPassword = mockUser.password;

            const resp = await mock.runRouteHandler(patchUser, { username });
            expect(resp.payload).toStrictEqual({ status: 'UPDATED', updated: ['password'] });
            expect(mock.users.updateManySpy).toBeCalled();
            expect(mock.users.data[0].password).not.toEqual(oldPassword);

            done();
        });
        it('should update username and password', async done => {
            const newUsername = 'new-username';
            const newPassword = 'new-password';

            const mock = new MockEnvironment();
            const user = mock.createUser();
            mock.request.body.username = newUsername;
            mock.request.body.password = newPassword;

            const username = user.username;

            const resp = await mock.runRouteHandler(patchUser, { username });
            expect(resp.payload).toStrictEqual({ status: 'UPDATED', updated: ['username', 'password'] });
            expect(mock.users.updateManySpy).toBeCalledTimes(2);
            expect(user.username).toBe(newUsername);

            done();
        });
        it('should update username in user\'s post', async done => {
            const newUsername = 'new-username';

            const mock = new MockEnvironment();
            const user = mock.createUser();
            mock.request.body.username = newUsername;

            const oldUsername = user.username;
            mock.posts.data.push(...fillArray(4, () => new MockPost(oldUsername)));

            const resp = await mock.runRouteHandler(patchUser, { username: oldUsername });
            expect(resp.payload).toStrictEqual({ status: 'UPDATED', updated: ['username'] });
            expect(mock.users.updateManySpy).toBeCalledWith({ username: oldUsername }, { $set: { username: newUsername } });
            expect(mock.posts.updateManySpy).toBeCalledWith({ author: oldUsername }, { $set: { author: newUsername } });
            expect(mock.users.data[0].username).toBe(newUsername);
            mock.posts.data.forEach(post => expect(post.author).toBe(newUsername));

            done();
        });
    });
});
