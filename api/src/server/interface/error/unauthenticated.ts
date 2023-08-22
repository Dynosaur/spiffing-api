import { RoutePayload } from 'route-handling/route-infra';

export interface IUnauthenticated {
    error: 'Unauthenticated';
    ok: false;
}

export class Unauthenticated implements RoutePayload<IUnauthenticated> {
    code = 401;
    message = 'Request was unauthenticated.';
    payload = { error: 'Unauthenticated' as const, ok: false as const };
}
