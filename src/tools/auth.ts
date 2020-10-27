import { RoutePayload } from '../server/route-handling/route-handler';
import { couldNotParseRequest } from '../server/route-handling/response-functions';
import { AuthParseErrorResponse } from '../server/interface/responses/error-responses';

// Could be a vulnerability? Regex may be exploited
export function decodeBasicAuth(authorizationHeader: string): {
    username: string;
    password: string;
    errorResp: RoutePayload<AuthParseErrorResponse>;
} {
    const base64 = authorizationHeader.substring(6);
    const plainText = Buffer.from(base64, 'base64').toString('ascii');

    const usernameRegex = plainText.match(/^(.+):/);
    if (!usernameRegex) {
        return { username: null, password: null, errorResp: couldNotParseRequest('username') };
    }
    const username = usernameRegex[1];

    const passwordRegex = plainText.match(/:(.+)$/);
    if (!passwordRegex) {
        return { username: null, password: null, errorResp: couldNotParseRequest('password') };
    }
    const password = passwordRegex[1];

    return { username, password, errorResp: null };
}

export function encodeBasicAuth(username:string, password:string):string {
    const base64 = btoa(username + ':' + password);
    return 'Basic ' + base64;
}
