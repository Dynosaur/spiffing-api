import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { IUnauthenticated, Unauthenticated } from 'interface/error/unauthenticated';
import { IAuthorizationParse } from 'interface/error/authorization-parse';
import { Request } from 'express';
import { User } from 'interface/data-types';
import { decodeBasicAuth } from 'tools/auth';

export namespace ICreateUser {
    export interface IUsernameTaken {
        error: 'Username Taken';
        ok: false;
    }

    export type ErrorTx = IAuthorizationParse | IUnauthenticated | IUsernameTaken;

    export interface Success {
        ok: true;
        user: User;
    }

    export type Tx = ErrorTx | Success;
}

type ReturnType = Promise<RoutePayload<ICreateUser.Tx>>;
export async function createUser(request: Request, actions: DatabaseActions): ReturnType {
    if (request.headers.authorization === undefined) return new Unauthenticated();

    const decode = decodeBasicAuth(request.headers.authorization);
    if (decode.ok === false) return decode.error;

    if (await actions.user.getByUsername(decode.username)) return {
        code: 409,
        message: `Username '${decode.username} is already taken.`,
        payload: {
            error: 'Username Taken',
            ok: false
        }
    };

    const user = await actions.user.create(decode.username, actions.common.securePassword(decode.password));
    return {
        code: 201,
        message: `Created user '${user.username}'`,
        payload: {
            ok: true,
            user: user.toInterface()
        }
    };
}

export const route: HandlerRoute = {
    handler: createUser, method: 'POST', path: '/user'
};
