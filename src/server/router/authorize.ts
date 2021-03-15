import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { IUnauthenticated, Unauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized, Unauthorized } from 'interface/error/unauthorized';
import { IAuthorizationParse } from 'interface/error/authorization-parse';
import { Request } from 'express';
import { User } from 'interface/data-types';
import { decodeBasicAuth } from 'tools/auth';

export namespace IAuthorize {
    export type ErrTx = IAuthorizationParse | IUnauthenticated | IUnauthorized;

    export interface Success {
        ok: true;
        user: User;
    }

    export type Tx = ErrTx | Success;
}

type ReturnType = Promise<RoutePayload<IAuthorize.Tx>>

export async function authorize(request: Request, actions: DatabaseActions): ReturnType {
    if (request.headers.authorization === undefined) return new Unauthenticated();

    const decode = decodeBasicAuth(request.headers.authorization);
    if (decode.ok === false) return decode.error;

    const user = await actions.common.authorize(decode.username, decode.password);
    if (!user) return new Unauthorized();

    return {
        code: 200,
        message: `Successfully authorized user ${user.id}.`,
        payload: {
            ok: true,
            user: user.toInterface()
        }
    };
}

export const route: HandlerRoute = {
    handler: authorize, method: 'POST', path: '/authorize'
};
