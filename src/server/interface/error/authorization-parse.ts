import { RoutePayload } from 'route-handling/route-infra';

type FailedPart = 'Authorization Type' | 'Username' | 'Password';

export interface IAuthorizationParse {
    error: 'Authorization Header Parse';
    ok: false;
    part: FailedPart;
}

export class AuthorizationParse implements RoutePayload<IAuthorizationParse> {
    code = 400;
    message: string;
    payload: {
        error: 'Authorization Header Parse';
        ok: false;
        part: FailedPart;
    };

    constructor(part: FailedPart) {
        this.message = `Ran into an error while parsing the request's auth header's ${part}.`;
        this.payload = {
            error: 'Authorization Header Parse',
            ok: false,
            part
        };
    }
}
