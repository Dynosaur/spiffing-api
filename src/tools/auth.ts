import { AuthorizationParseError }  from 'interface-bindings/error-responses';
import { IAuthorizationParseError } from 'interface/responses/error-responses';
import { RoutePayload }             from 'route-handling/route-infra';
import { UndefinedError }           from 'tools/undefined-error';

const encodeMap = new Map();
encodeMap.set(' ', '%20');
encodeMap.set(':', '%3A');

export function decodeHttp(s: string): string {
    if (s === undefined || s === null) throw new UndefinedError('s', s);
    encodeMap.forEach((encoded, plain) => {
        s = s.replace(new RegExp(encoded, 'g'), plain);
    });
    return s;
}

export function encodeHttp(s: string): string {
    if (s === undefined || s === null) throw new UndefinedError('s', s);
    encodeMap.forEach((encoded, plain) => {
        s = s.replace(new RegExp(plain, 'g'), encoded);
    });
    return s;
}

export function decodeBasicAuth(authorizationHeader: string): RoutePayload<IAuthorizationParseError> | { username: string; password: string; } {
    if (authorizationHeader === undefined || authorizationHeader === null)
        throw new UndefinedError('authorizationHeader', authorizationHeader);

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
    if (username === undefined || username === null) throw new UndefinedError('username', username);
    if (password === undefined || password === null) throw new UndefinedError('password', password);
    username = encodeHttp(username);
    password = encodeHttp(password);

    const base64 = btoa(username + ':' + password);
    return 'Basic ' + base64;
}
