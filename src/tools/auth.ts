import { Automated } from 'interface/responses/error-responses';
import { RoutePayload } from 'server/route-handling/route-infra';
import { parsingError } from 'server/route-handling/response-functions';

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

export type DecodeResult = {
    ok: true;
    username: string;
    password: string;
} | {
    ok: false;
    error: RoutePayload<Automated.Failed.Tx>;
}

export function decodeBasicAuth(authorizationHeader: string): DecodeResult {
    const basicRegex = authorizationHeader.match(/^Basic /);
    if (!basicRegex) {
        return { ok: false, error: parsingError('type') };
    }

    const base64 = authorizationHeader.substring(6);
    const httpEncoded = Buffer.from(base64, 'base64').toString('ascii');

    const usernameRegex = httpEncoded.match(/^(.+):/);
    if (!usernameRegex) {
        return { ok: false, error: parsingError('username') };
    }
    const username = decodeHttp(usernameRegex[1]);

    const passwordRegex = httpEncoded.match(/:(.+)$/);
    if (!passwordRegex) {
        return { ok: false, error: parsingError('password') };
    }
    const password = decodeHttp(passwordRegex[1]);

    return { ok: true, username, password };
}

export function encodeBasicAuth(username: string, password: string): string {
    username = encodeHttp(username);
    password = encodeHttp(password);

    const base64 = btoa(username + ':' + password);
    return 'Basic ' + base64;
}
