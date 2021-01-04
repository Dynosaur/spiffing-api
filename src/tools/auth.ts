import { RoutePayload } from 'server/route-handling/route-infra';
import { AuthorizationParseError } from 'app/server/interface-bindings/error-responses';
import { IAuthorizationParseError, IUnauthorizedError } from 'interface/responses/error-responses';

const encodeMap = new Map();
encodeMap.set(' ', '%20');
encodeMap.set(':', '%3A');

export function decodeHttp(s: string): string {
    encodeMap.forEach((encoded, plain) => {
        s = s.replace(new RegExp(encoded, 'g'), plain);
    });
    return s;
}

export function encodeHttp(s: string): string {
    encodeMap.forEach((encoded, plain) => {
        s = s.replace(new RegExp(plain, 'g'), encoded);
    });
    return s;
}

export function decodeBasicAuth(
    resolve: (error: RoutePayload<IAuthorizationParseError | IUnauthorizedError>) => void,
    authorizationHeader: string
): { username: string; password: string; } {
    const ensureAuthorizationIsBasic = authorizationHeader.match(/^Basic /);
    if (!ensureAuthorizationIsBasic)
        resolve(new AuthorizationParseError('Authorization Type').toRoutePayload());

    const base64 = authorizationHeader.substring(6);
    const httpEncoded = Buffer.from(base64, 'base64').toString('ascii');

    const usernameRegex = httpEncoded.match(/^(.+):/);
    if (!usernameRegex)
        resolve(new AuthorizationParseError('Username').toRoutePayload());
    const username = decodeHttp(usernameRegex[1]);

    const passwordRegex = httpEncoded.match(/:(.+)$/);
    if (!passwordRegex)
        resolve(new AuthorizationParseError('Password').toRoutePayload());
    const password = decodeHttp(passwordRegex[1]);

    return { username, password };
}

export function encodeBasicAuth(username: string, password: string): string {
    username = encodeHttp(username);
    password = encodeHttp(password);

    const base64 = btoa(username + ':' + password);
    return 'Basic ' + base64;
}
