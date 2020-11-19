import { RoutePayload } from './route-infra';
import { routePayload } from './route-handler';
import { AuthParseErrorResponse, InternalServerErrorResponse, MissingDataErrorResponse,
UnauthorizedError, UnauthorizedErrorResponse, UserNoExistErrorResponse } from '../interface/responses/error-responses';

export function payload<T>(httpCode: number, message: string, payload: T): RoutePayload<T> {
    return { httpCode, consoleMessage: message, payload };
}

export function couldNotParseRequest(thing: 'username' | 'password' | 'type'): RoutePayload<AuthParseErrorResponse> {
    const message = `There was an error parsing the request's ${thing}.`;
    return {
        consoleMessage: message,
        httpCode: 400,
        payload: {
            field: thing,
            message,
            status: 'E_AUTH_HEADER_PARSE'
        }
    };
}

export function missingData(possible: string[][], provided: object, name: string): RoutePayload<MissingDataErrorResponse> {
    const consoleMessage = `Malformed request ${name}.
    \n\tRequired: [${possible.join(' OR ')}]
    \n\tProvided: [${Object.keys(provided)}]`;
    return routePayload<MissingDataErrorResponse>(400, consoleMessage, {
        status: 'MISSING_DATA',
        missing: { possible, provided: Object.keys(provided), scope: name }
    });
}

export function internalError(message: string): RoutePayload<InternalServerErrorResponse> {
    return payload<InternalServerErrorResponse>(500, message, {
        status: 'E_INTERNAL',
        message
    });
}

export function unauthorized(why: UnauthorizedError): RoutePayload<UnauthorizedErrorResponse> {
    return payload<UnauthorizedErrorResponse>(401, 'Authentication failed.', { status: why });
}

export function userDoesNotExist(): RoutePayload<UserNoExistErrorResponse> {
    return payload<UserNoExistErrorResponse>(404, 'The user could not be found.', { status: 'E_USER_NO_EXIST' });
}
