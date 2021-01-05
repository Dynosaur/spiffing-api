import { decodeBasicAuth } from 'app/tools/auth';
import { RouteInfo, RouteHandler, RoutePayload } from 'server/route-handling/route-infra';
import { Authorize, Deregister, Patch, Register } from '../interface-bindings/auth-responses';
import { IAuthorize, IDeregister, IPatch, IRegister } from 'interface/responses/auth-endpoints';
import { authorizeOrFail, requestMustBeAuthenticated } from '../route-handling/route-handler';
import { AuthHeaderIdParamError, NoUserFoundError, UnauthorizedError } from '../interface-bindings/error-responses';

export const register: RouteHandler<IRegister.Tx> = function register(request, actions): Promise<RoutePayload<IRegister.Tx>> {
    return new Promise<RoutePayload<IRegister.Tx>>(async resolve => {
        requestMustBeAuthenticated(resolve, request.headers.authorization);
        const userInfo = decodeBasicAuth(resolve, request.headers.authorization);
        if (await actions.user.readUser({ username: userInfo.username }))
            resolve(new Register.UserExistsError(userInfo.username).toRoutePayload());
        const user = await actions.user.createUser(userInfo.username, actions.common.securePassword(userInfo.password));
        resolve(new Register.Success(user.toInterface()).toRoutePayload());
    });
};

export const authorize: RouteHandler<IAuthorize.Tx> = function authenticate(request, actions): Promise<RoutePayload<IAuthorize.Tx>> {
    return new Promise<RoutePayload<IAuthorize.Tx>>(async resolve => {
        const user = await authorizeOrFail(resolve, actions.common, request.headers.authorization);
        if (user.id !== request.params.id)
            resolve(new AuthHeaderIdParamError(user.id, request.params.id).toRoutePayload());
        resolve(new Authorize.Success(user).toRoutePayload());
    });
};

export const deregister: RouteHandler<IDeregister.Tx> = function deregister(request, actions): Promise<RoutePayload<IDeregister.Tx>> {
    return new Promise<RoutePayload<IDeregister.Tx>>(async resolve => {
        requestMustBeAuthenticated(resolve, request.headers.authorization);

        const decoded = decodeBasicAuth(resolve, request.headers.authorization);
        if (!await actions.user.readUser({ username: decoded.username }))
            resolve(new NoUserFoundError(decoded.username).toRoutePayload());

        const user = await actions.common.authorize(decoded.username, decoded.password);
        if (!user)
            resolve(new UnauthorizedError().toRoutePayload());

        if (user.id !== request.params.id)
            resolve(new AuthHeaderIdParamError(user.id, request.params.id).toRoutePayload());

        await user.delete();

        resolve(new Deregister.Success(user).toRoutePayload());
    });
};

export const patchUser: RouteHandler<IPatch.Tx> = async function patchUser(request, actions): Promise<RoutePayload<IPatch.Tx>> {
    return new Promise<RoutePayload<IPatch.Tx>>(async resolve => {
        const user = await authorizeOrFail(resolve, actions.common, request.headers.authorization);
        if (user.id !== request.params.id)
            resolve(new AuthHeaderIdParamError(user.id, request.params.id).toRoutePayload());

        const updated: string[] = [];
        const rejected: string[] = [];

        for (const key of Object.keys(request.body)) {
            if (key === 'password') {
                await user.update({ password: actions.common.securePassword(request.body.password) });
                updated.push('password');
            } else if (key === 'screenname') {
                await user.update({ screenname: request.body.screenname });
                updated.push('screenname');
            } else if (key === 'username') {
                await user.update({ username: request.body.username });
                updated.push('username');
            } else
                rejected.push(key);
        }

        resolve(new Patch.Success(user, updated, rejected).toRoutePayload());
    });
};

export const routes: RouteInfo[] = [
    { method: 'POST',   path: '/api/user/:id',      handler: register },
    { method: 'POST',   path: '/api/authorize/:id', handler: authorize },
    { method: 'DELETE', path: '/api/user/:id',      handler: deregister },
    { method: 'PATCH',  path: '/api/user/:id',      handler: patchUser }
];
