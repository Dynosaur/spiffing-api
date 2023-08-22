import { RoutePayload } from 'route-handling/route-infra';

export interface IUnauthorized {
    error: 'Unauthorized';
    ok: false;
}

export class Unauthorized implements RoutePayload<IUnauthorized> {
    code = 403;
    message = 'Request was unauthorized.';
    payload = { error: 'Unauthorized' as const, ok: false as const };
}
