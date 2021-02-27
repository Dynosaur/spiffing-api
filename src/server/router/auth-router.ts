import { decodeBasicAuth } from 'app/tools/auth';
import { RouteInfo, RouteHandler, RoutePayload } from 'server/route-handling/route-infra';
import { Authorize, Deregister, Patch, Register } from '../interface-bindings/auth-responses';
import { IAuthorize, IDeregister, IPatch, IRegister } from 'interface/responses/auth-endpoints';
import { AuthHeaderIdParamError, UnauthenticatedError, UnauthorizedError } from '../interface-bindings/error-responses';

export const register: RouteHandler<IRegister.Tx> = async function register(request, actions): Promise<RoutePayload<IRegister.Tx>> {
        if (!request.headers.authorization) return new UnauthenticatedError();

        const decodeAttempt = decodeBasicAuth(request.headers.authorization);
        if (decodeAttempt instanceof RoutePayload) return decodeAttempt;

        if (await actions.user.getByUsername(decodeAttempt.username))
            return new Register.UserExistsError(decodeAttempt.username);

        const user = await actions.user.create(
            decodeAttempt.username,
            actions.common.securePassword(decodeAttempt.password)
        );
        return new Register.Success(user.toInterface());
};

export const authorize: RouteHandler<IAuthorize.Tx> = async function authenticate(request, actions): Promise<RoutePayload<IAuthorize.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();

    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;

    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();

    return new Authorize.Success(user);
};

export const deregister: RouteHandler<IDeregister.Tx> = async function deregister(request, actions): Promise<RoutePayload<IDeregister.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();

    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;
    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();
    if (user.username !== request.params.id) return new AuthHeaderIdParamError(user.id, request.params.id);

    await actions.user.delete(user._id);
    return new Deregister.Success(user);
};

export const patchUser: RouteHandler<IPatch.Tx> = async function patchUser(request, actions): Promise<RoutePayload<IPatch.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();

    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;
    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();
    if (user.id !== request.params.id && user.username !== request.params.id) return new AuthHeaderIdParamError(user.id, request.params.id);

    const updated: string[] = [];
    const rejected: string[] = [];

    for (const key of Object.keys(request.body))
        if (key === 'password') {
            await actions.user.updateSet(user._id, { password: actions.common.securePassword(request.body.password) });
            updated.push('password');
        } else if (key === 'screenname') {
            await actions.user.updateSet(user._id, { screenname: request.body.screenname });
            updated.push('screenname');
        } else if (key === 'username') {
            await actions.user.updateSet(user._id, { username: request.body.username });
            updated.push('username');
        } else
            rejected.push(key);

    return new Patch.Success(user, updated, rejected);
};

export const routes: RouteInfo[] = [
    { method: 'POST',   path: '/api/user/:id',  handler: register },
    { method: 'POST',   path: '/api/authorize', handler: authorize },
    { method: 'DELETE', path: '/api/user/:id',  handler: deregister },
    { method: 'PATCH',  path: '/api/user/:id',  handler: patchUser }
];
