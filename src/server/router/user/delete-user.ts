import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { IUnauthenticated, Unauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized, Unauthorized } from 'interface/error/unauthorized';
import { IAuthorizationParse } from 'interface/error/authorization-parse';
import { IObjectIdParse } from 'interface/error/object-id-parse';
import { Request } from 'express';
import { decodeBasicAuth } from 'tools/auth';

export namespace IDeleteUser {
    export type ErrTx =
        | IAuthorizationParse
        | IObjectIdParse
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        ok: true;
    }

    export type Tx = ErrTx | Success;
}

type ReturnType = Promise<RoutePayload<IDeleteUser.Tx>>
export async function deleteUser(request: Request, actions: DatabaseActions): ReturnType {
    if (!request.headers.authorization) return new Unauthenticated();

    const decode = decodeBasicAuth(request.headers.authorization);
    if (decode.ok === false) return decode.error;
    const user = await actions.common.authorize(decode.username, decode.password);
    if (!user) return new Unauthorized();

    await actions.user.delete(user._id);
    return {
        code: 200,
        message: `Deleted user ${user.username} (${user.id}).`,
        payload: { ok: true }
    };
}

export const route: HandlerRoute = {
    handler: deleteUser, method: 'DELETE', path: '/user'
};
