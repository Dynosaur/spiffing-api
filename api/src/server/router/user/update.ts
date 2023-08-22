import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { IUnauthenticated, Unauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized, Unauthorized } from 'interface/error/unauthorized';
import { DbUser } from 'database/user';
import { IAuthorizationParse } from 'interface/error/authorization-parse';
import { Request } from 'express';
import { decodeBasicAuth } from 'tools/auth';

export namespace IUpdateUser {
    export type ErrTx =
        | IAuthorizationParse
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        ok: true;
        rejected: string[];
        updated: string[];
    }

    export type Tx = ErrTx | Success;
}

type ReturnType = Promise<RoutePayload<IUpdateUser.Tx>>;

export async function updateUser(request: Request, actions: DatabaseActions): ReturnType {
    if (request.headers.authorization === undefined) return new Unauthenticated();

    const decode = decodeBasicAuth(request.headers.authorization);
    if (decode.ok === false) return decode.error;
    const user = await actions.common.authorize(decode.username, decode.password);
    if (!user) return new Unauthorized();

    const updated: string[] = [];
    const rejected: string[] = [];
    const changes: Partial<DbUser> = {};

    for (const key of Object.keys(request.body)) {
        switch (key) {
            case 'password':
                changes.password = actions.common.securePassword(request.body.password);
                updated.push(key);
                break;
            case 'screenname':
                changes.screenname = request.body.screenname;
                updated.push(key);
                break;
            case 'username':
                changes.username = request.body.username;
                updated.push(key);
                break;
            default:
                rejected.push(key);
        }
    }

    await actions.user.updateSet(user._id, changes);
    return {
        code: 200,
        message: `Successfully updated user ${user.id} ${updated.join(', ')}.`,
        payload: {
            ok: true,
            rejected,
            updated
        }
    };
}

export const route: HandlerRoute = {
    handler: updateUser, method: 'PATCH', path: '/user'
};
