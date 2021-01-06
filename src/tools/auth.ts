import { RoutePayload } from 'server/route-handling/route-infra';
import { AuthorizationParseError, UnauthenticatedError } from 'app/server/interface-bindings/error-responses';
import { IAuthorizationParseError, IUnauthenticatedError } from 'interface/responses/error-responses';

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

export function decodeBasicAuth(authorizationHeader: string): RoutePayload<IAuthorizationParseError | IUnauthenticatedError> | { username: string; password: string; } {
    if (!authorizationHeader) return new UnauthenticatedError();

    const ensureAuthorizationIsBasic = authorizationHeader.match(/^Basic /);
    if (!ensureAuthorizationIsBasic) return new AuthorizationParseError('Authorization Type');

    const base64 = authorizationHeader.substring(6);
    const httpEncoded = Buffer.from(base64, 'base64').toString('ascii');

    const usernameRegex = httpEncoded.match(/^(.+):/);
    if (!usernameRegex)
        return new AuthorizationParseError('Username');
    const username = decodeHttp(usernameRegex[1]);

    const passwordRegex = httpEncoded.match(/:(.+)$/);
    if (!passwordRegex)
        return new AuthorizationParseError('Password');
    const password = decodeHttp(passwordRegex[1]);

    return { username, password };
}

export function encodeBasicAuth(username: string, password: string): string {
    username = encodeHttp(username);
    password = encodeHttp(password);

    const base64 = btoa(username + ':' + password);
    return 'Basic ' + base64;
}
