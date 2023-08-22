import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { IUnauthenticated, Unauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized, Unauthorized } from 'interface/error/unauthorized';
import { IAuthorizationParse } from 'interface/error/authorization-parse';
import { Rates } from 'interface/data-types';
import { Request } from 'express';
import { decodeBasicAuth } from 'tools/auth';

export namespace IGetRate {
    export type ErrorTx = IAuthorizationParse | IUnauthenticated | IUnauthorized;

    export interface Success {
        ok: true;
        rates: Rates;
    }

    export type Tx = ErrorTx | Success;
}

type ReturnType = Promise<RoutePayload<IGetRate.Tx>>;

export async function getRate(request: Request, actions: DatabaseActions): ReturnType {
    if (!request.headers.authorization) return new Unauthenticated();

    const decode = decodeBasicAuth(request.headers.authorization);
    if (!decode.ok) return decode.error;
    const user = await actions.common.authorize(decode.username, decode.password);
    if (!user) return new Unauthorized();

    const rate = await actions.user.getUserRateApi(user._id);
    return {
        code: 200,
        message: `Retreived user ${user.id} ratings.`,
        payload: {
            ok: true,
            rates: rate.getInterfaceRates()
        }
    };
}

export const route: HandlerRoute = {
    handler: getRate, method: 'GET', path: '/rate/:id'
};
