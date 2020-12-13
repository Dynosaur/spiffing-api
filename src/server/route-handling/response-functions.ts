import { payload, RoutePayload } from 'server/route-handling/route-infra';
import { AuthParseErrorResponse, MissingDataError, UnauthorizedErrorResponse } from 'interface/responses/error-responses';

export function couldNotParseRequest(field: 'username' | 'password' | 'type'): RoutePayload<AuthParseErrorResponse> {
    return payload<AuthParseErrorResponse>(`There was an error parsing the request's ${field}.`, 400, false, {
        error: 'Authorization Header Parse',
        field
    });
}

export function missingData(possible: string[][], provided: object, name: string): RoutePayload<MissingDataError> {
    const message = `Malformed request ${name}.
    \n\tRequired: [${possible.join(' OR ')}]
    \n\tProvided: [${Object.keys(provided)}]`;
    return payload<MissingDataError>(message, 400, false, {
        error: 'Missing Requirements',
        missing: {
            possible,
            provided: Object.keys(provided),
            scope: name
        },
    });
}

export function unauthorized(): RoutePayload<UnauthorizedErrorResponse> {
    return payload<UnauthorizedErrorResponse>('Authentication failed.', 200, false, {
        error: 'Authorization Failed'
    });
}
