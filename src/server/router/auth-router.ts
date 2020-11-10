import { AuthenticateEndpoint, DeregisterEndpoint, PatchEndpoint, RegisterEndpoint } from '../interface/responses/auth-endpoints';
import { RouteInfo, RouteHandler } from '../route-handling/route-infra';
import { internalError, payload } from '../route-handling/response-functions';
import { routePayload } from '../route-handling/route-handler';


export const register: RouteHandler<RegisterEndpoint> = async function register(request, actions, checks, args) {
    const check = await checks.userMustNotExist(args.username);
    if (check) {
        return check;
    }

    if (request.query.test) {
        return payload<RegisterEndpoint>(200, 'Test register successful, no users created.', {
            status: 'TEST_OK'
        });
    } else {
        await actions.createUser(args.username, args.password);
        return payload<RegisterEndpoint>(201, `Successfully created new user "${args.username}"`, {
            status: 'CREATED'
        });
    }
};

export const authenticate: RouteHandler<AuthenticateEndpoint> = async function authenticate(request, actions, checks) {
    return payload<AuthenticateEndpoint>(200, 'Successful authentication.', {
        status: 'OK'
    });
};

export const deregister: RouteHandler<DeregisterEndpoint> = async function deregister(request, actions, checks, args) {
    const username = args.username;

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

export const patchUser: RouteHandler<PatchEndpoint> = async function patchUser(request, actions, checks, args) {
    let currentUsername = args.username;
    const proposedUsername = request.body.username;
    const proposedPassword = request.body.password;

    const updated: string[] = [];
    if (proposedUsername && proposedUsername !== currentUsername) {
        const up = await actions.updateUsername(currentUsername, proposedUsername);
        if (up.status === 'NO_MATCH') {
            return routePayload<PatchEndpoint>(404, up.message, {
                status: 'E_USER_NO_EXIST'
            });
        }
        currentUsername = proposedUsername;
        updated.push('username');
    }
    if (proposedPassword) {
        const up = await actions.updatePassword(currentUsername, proposedPassword);
        if (up.status === 'NO_MATCH') {
            return routePayload<PatchEndpoint>(404, up.message, {
                status: 'E_USER_NO_EXIST'
            });
        }
        updated.push('password');
    }

    if (updated.length) {
        return routePayload<PatchEndpoint>(200, `Updated ${updated.join(', ')}.`, {
            status: 'UPDATED', updated
        });
    } else {
        return routePayload<PatchEndpoint>(200, 'No valid username or password change.', {
            status: 'NO_CHANGE'
        });
    }
};

export const routes: RouteInfo[] = [
    {
        method: 'POST',
        path: '/api/user/:username',
        handler: register,
        requirements: {
            auth: {
                checkParamUsername: true,
                method: 'pass'
            },
            scope: {
                query: {
                    required: [],
                    replacements: {
                        test: false
                    }
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/authenticate',
        handler: authenticate,
        requirements: {
            auth: {
                checkParamUsername: false,
                method: 'authenticate'
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/user/:username',
        handler: deregister,
        requirements: {
            auth: {
                checkParamUsername: true,
                method: 'authenticate'
            }
        }
    },
    {
        method: 'PATCH',
        path: '/api/user/:username',
        handler: patchUser,
        requirements: {
            scope: {
                body: {
                    required: [
                        ['username'], ['password']
                    ],
                    replacements: { }
                }
            },
            auth: {
                checkParamUsername: true,
                method: 'authenticate'
            }
        }
    }
];
