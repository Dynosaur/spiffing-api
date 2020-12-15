import { Authenticate, Deregister, Patch, Register } from 'interface/responses/auth-endpoints';
import { payload, RouteInfo, RouteHandler, RoutePayload } from 'server/route-handling/route-infra';

export const register: RouteHandler<Register.Tx> = async function register(request, actions, args): Promise<RoutePayload<Register.Tx>> {
    if (await actions.user.readUser({ username: args.username })) {
        return payload<Register.Failed.UserExists>('User already exists with that username.', 200, false, {
            error: 'User Already Exists'
        });
    }

    const user = await actions.user.createUser(args.username, actions.common.securePassword(args.password));
    return payload<Register.Ok.Created>(`Successfully created new user ${args.username}`, 201, true, {
        status: 'Created',
        user: user.toInterface()
    });
};

export const authenticate: RouteHandler<Authenticate.Tx> = async function authenticate(): Promise<RoutePayload<Authenticate.Tx>> {
    return payload<Authenticate.Ok>('Authentication successful.', 200, true, null);
};

export const deregister: RouteHandler<Deregister.Tx> = async function deregister(request, actions, args): Promise<RoutePayload<Deregister.Tx>> {
    const username = args.username;
    const user = await actions.user.readUser({ username });
    if (user) {
        await user.delete();
        return payload<Deregister.Ok>(`User ${username} and their posts have been removed.`, 200, true, null);
    } else {
        return payload<Deregister.Failed.NoUser>(`No user with the username ${username}.`, 200, false, { error: 'No User' });
    }
};

export const patchUser: RouteHandler<Patch.Tx> = async function patchUser(request, actions, args): Promise<RoutePayload<Patch.Tx>> {
    const user = await actions.user.readUser({ username: args.username });
    if (user) {
        const updated: string[] = [];
        for (const key of ['username', 'password', 'screenname']) {
            if (request.body[key]) {
                if (key === 'password') {
                    await user.update({ password: actions.common.securePassword(request.body.password) });
                    updated.push(key);
                    continue;
                }
                await user.update({ [key]: request.body[key] });
                updated.push(key);
            }
        }
        return payload<Patch.Ok.Updated>(updated.length ? `Updated ${updated.join(', ')}.` : 'No changes warranted.', 200, true, { updated });
    } else {
        return payload<Patch.Failed.NoUser>(`The user ${args.username} does not exist.`, 200, false, { error: 'No User' });
    }
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
