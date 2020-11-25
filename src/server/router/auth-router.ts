import { convertDbUser } from 'database/database-actions';
import { SuccessfulResponse } from 'interface/response';
import { payload, RouteInfo, RouteHandler, RoutePayload }
from 'server/route-handling/route-infra';
import { AuthenticateEndpoint, DeregisterEndpoint, DeregisterErrorResponse,
PatchEndpoint, PatchUpdatedResponse, RegisterCreatedResponse, RegisterEndpoint,
RegisterTestResponse } from 'interface/responses/auth-endpoints';

export const register: RouteHandler<RegisterEndpoint> =
async function register(request, actions, checks, args): Promise<RoutePayload<RegisterEndpoint>> {
    const check = await checks.userMustNotExist(args.username);
    if (check) {
        return check;
    }

    if (request.query.test) {
        return payload<RegisterTestResponse>(
            'Successful test registration, no user created.',
            200, true, { status: 'Ok Test' }
        );
    } else {
        return payload<RegisterCreatedResponse>(
            `Successfully created new user ${args.username}`, 201, true, {
                status: 'Ok',
                user: convertDbUser(await actions.createUser(args.username, args.password))
            }
        );
    }
};

export const authenticate: RouteHandler<AuthenticateEndpoint> =
async function authenticate(): Promise<RoutePayload<AuthenticateEndpoint>> {
    return payload<SuccessfulResponse>('Authentication successful.', 200, true, null);
};

export const deregister: RouteHandler<DeregisterEndpoint> =
async function deregister(request, actions, checks, args): Promise<RoutePayload<DeregisterEndpoint>> {
    const username = args.username;

    if (!await actions.deleteUser(username)) {
        return payload<DeregisterErrorResponse>(
            `User ${username} was not deleted during deregistration.`,
            500, false, { error: 'User Removal' }
        );
    }
    if (!await actions.deletePosts({ author: username })) {
        return payload<DeregisterErrorResponse>(
            `User ${username}'s post were not deleted during deregistration.`,
            500, false, { error: 'Posts Removal' }
        );
    }

    return payload<SuccessfulResponse>(
        `User ${username} and their posts have been removed.`,
        200, true, null
    );
};

export const patchUser: RouteHandler<PatchEndpoint> =
async function patchUser(request, actions, checks, args): Promise<RoutePayload<PatchEndpoint>> {
    let currentUsername = args.username;
    const proposedUsername = request.body.username;
    const proposedPassword = request.body.password;

    const updated: string[] = [];
    if (proposedUsername && proposedUsername !== currentUsername) {
        await actions.updateUsername(currentUsername, proposedUsername);
        currentUsername = proposedUsername;
        updated.push('username');
    }
    if (proposedPassword) {
        await actions.updatePassword(currentUsername, proposedPassword);
        updated.push('password');
    }

    return payload<PatchUpdatedResponse>(
        updated.length ? `Updated ${updated.join(', ')}.` : 'No changes warranted.',
        200, true, { updated }
    );
};

export const routes: RouteInfo[] = [
    {
        method: 'POST', path: '/api/user/:username', handler: register,
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
        method: 'POST', path: '/api/authenticate', handler: authenticate,
        requirements: {
            auth: {
                checkParamUsername: false,
                method: 'authenticate'
            }
        }
    },
    {
        method: 'DELETE', path: '/api/user/:username', handler: deregister,
        requirements: {
            auth: {
                checkParamUsername: true,
                method: 'authenticate'
            }
        }
    },
    {
        method: 'PATCH', path: '/api/user/:username', handler: patchUser,
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
