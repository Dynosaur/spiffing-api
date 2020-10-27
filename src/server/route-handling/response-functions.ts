import { RoutePayload, routePayload } from './route-handler';
import { AuthParseErrorResponse, InternalServerErrorResponse, MissingDataErrorResponse } from '../interface/responses/error-responses';

export function payload<T>(httpCode: number, message: string, payload: T): RoutePayload<T> {
    return { httpCode, consoleMessage: message, payload };
}

export function couldNotParseRequest(thing: 'username' | 'password'): RoutePayload<AuthParseErrorResponse> {
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

export function missingData(missing: string[], scope: string): RoutePayload<MissingDataErrorResponse> {
    const count = missing.length;
    return routePayload<MissingDataErrorResponse>(400, `Missing param${count > 1 ? 's' : ''}: ${missing.join(', ')} in request ${scope}.`, {
        status: 'MISSING_DATA',
        missing: { count, data: missing, scope }
    });
}

export function internalError(message: string): RoutePayload<InternalServerErrorResponse> {
    return payload<InternalServerErrorResponse>(500, message, {
        status: 'E_INTERNAL',
        message
    });
}
