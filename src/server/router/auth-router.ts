import { AuthenticateEndpoint, DeregisterEndpoint, PatchEndpoint, RegisterEndpoint } from '../interface/responses/auth-endpoints';
import { ExportedRoutes, RouteHandler } from '../route-handling/route-handler';
import { internalError, payload } from '../route-handling/response-functions';
import { decodeBasicAuth } from '../../tools/auth';

/*
    TODO:
        - Automate authentication?
            - For requests that require authentication such as register, authentication, etc..., find a way
            to somehow not have to rewrite the same accessing of the decodeBasicAuth shit every time. Perhaps I misunderstand
        - Combine Request and Response types into an "Action" type to shorten function signatures
*/

const register: RouteHandler<RegisterEndpoint> = async (request, actions, checks) => {
    const username = request.params.username;

    const check = await checks.userMustNotExist(username);
    if (check) { return check; }

    const isRegisterTest = request.query.test;

    const decoded = decodeBasicAuth(request.headers.authorization);
    if (decoded.errorResp) { return decoded.errorResp; }
    const password = decoded.password;

    if (isRegisterTest) {
        return payload<RegisterEndpoint>(200, 'Test register successful, no users created.', {
            status: 'TEST_OK'
        });
    } else {
        await actions.createUser(username, password);
        return payload<RegisterEndpoint>(201, `Successfully created new user "${username}"`, {
            status: 'CREATED'
        });
    }
};

const authenticate: RouteHandler<AuthenticateEndpoint> = async (request, actions, checks) => {
    const check = await checks.authenticate(request);
    switch (check.state) {
        case 'error':
            return check.error;
        case 'ok':
            break;
        default:
            throw new Error(`Unexpected check state:\n${JSON.stringify(check, null, 4)}`);
    }

    return payload<AuthenticateEndpoint>(200, 'Successful authentication.', {
        status: 'OK'
    });
};

const deregister: RouteHandler<DeregisterEndpoint> = async (request, actions, checks) => {
    const username = request.params.username;
    const check = await checks.authenticate(request);
    switch (check.state) {
        case 'error':
            return check.error;
        case 'ok':
            break;
        default:
            throw new Error(`Unexpected check state:\n${JSON.stringify(check, null, 4)}`);
    }

    if (!await actions.deleteUser(username)) {
        return internalError('There was an error while removing your account.');
    }
    if (!await actions.deletePosts({ author: username })) {
        return internalError('There was an error while removing your posts.');
    }

    return payload<DeregisterEndpoint>(200, `User ${username} and its posts successfully deleted.`, {
        status: 'DELETED'
    });
};

const patchUser: RouteHandler<PatchEndpoint> = async (request, actions, checks) => {
    const authCheck = await checks.authenticate(request);
    let currentUsername: string;
    switch (authCheck.state) {
        case 'error':
            return authCheck.error;
        case 'ok':
            currentUsername = authCheck.username;
            break;
        default:
            throw new Error(`Unexpected check state:\n${JSON.stringify(authCheck, null, 4)}`);
    }

    const scopeCheck = checks.checkScope(['username', 'password'], request.body, 'body', 'one');
    if (scopeCheck) {
        return scopeCheck;
    }

    const proposedUsername = request.body.username;
    const proposedPassword = request.body.password;
    const validUsernameRequest = !!proposedUsername && proposedUsername !== currentUsername;
    if (validUsernameRequest && proposedPassword) {
        await actions.updatePassword(currentUsername, proposedPassword);
        await actions.updateUsername(currentUsername, proposedUsername);
        return { httpCode: 200, consoleMessage: 'Updated username and password.', payload: {
            status: 'UPDATED',
            updated: ['username', 'password']
        }};
    } else if (validUsernameRequest) {
        await actions.updateUsername(currentUsername, proposedUsername);
        return { httpCode: 200, consoleMessage: 'Updated username.', payload: {
            status: 'UPDATED',
            updated: ['username']
        }};
    } else if (proposedPassword) {
        await actions.updatePassword(currentUsername, proposedPassword);
        return { httpCode: 200, consoleMessage: 'Updated password.', payload: {
            status: 'UPDATED',
            updated: ['password']
        }};
    } else {
        return internalError('Unknown path.');
    }
};

export function authRoutes(): ExportedRoutes {
    return [
        { method: 'POST',   path: '/api/user/:username', handler: register },
        { method: 'POST',   path: '/api/authenticate',   handler: authenticate },
        { method: 'DELETE', path: '/api/user/:username', handler: deregister },
        { method: 'PATCH',  path: '/api/user/:username', handler: patchUser }
    ];
}
