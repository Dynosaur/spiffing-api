import { AuthorizationParse } from 'interface/error/authorization-parse';
import { UndefinedError } from 'tools/undefined-error';

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

export type ReturnType = { ok: true; username: string; password: string; } |
                         { ok: false; error: AuthorizationParse };
export function decodeBasicAuth(authorizationHeader: string): ReturnType {
    if (authorizationHeader === undefined || authorizationHeader === null)
        throw new UndefinedError('authorizationHeader', authorizationHeader);

    const ensureAuthorizationIsBasic = authorizationHeader.match(/^Basic /);
    if (!ensureAuthorizationIsBasic) return {
        error: new AuthorizationParse('Authorization Type'),
        ok: false
    };

    const base64 = authorizationHeader.substring(6);
    const httpEncoded = Buffer.from(base64, 'base64').toString('ascii');

    const usernameRegex = httpEncoded.match(/^(.+):/);
    if (!usernameRegex) return {
        error: new AuthorizationParse('Username'),
        ok: false
    };
    const username = decodeHttp(usernameRegex[1]);

    const passwordRegex = httpEncoded.match(/:(.+)$/);
    if (!passwordRegex) return {
        error: new AuthorizationParse('Password'),
        ok: false
    };
    const password = decodeHttp(passwordRegex[1]);

    return { ok: true, password, username };
}

export function encodeBasicAuth(username: string, password: string): string {
    if (username === undefined || username === null) throw new UndefinedError('username', username);
    if (password === undefined || password === null) throw new UndefinedError('password', password);
    username = encodeHttp(username);
    password = encodeHttp(password);

    const base64 = btoa(username + ':' + password);
    return 'Basic ' + base64;
}
