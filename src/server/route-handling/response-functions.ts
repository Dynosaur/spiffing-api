import { Automated } from 'interface/responses/error-responses';
import { payload, RoutePayload } from 'server/route-handling/route-infra';

export function parsingError(field: 'username' | 'password' | 'type'): RoutePayload<Automated.Failed.Parse> {
    return payload<Automated.Failed.Parse>(`There was an error parsing the request's ${field}.`, 400, false, {
        error: 'Authorization Header Parse',
        field
    });
}

export function missingData(possible: string[][], provided: object, name: string): RoutePayload<Automated.Failed.MissingData> {
    const message = `Malformed request ${name}.
    \n\tRequired: [${possible.join(' OR ')}]
    \n\tProvided: [${Object.keys(provided)}]`;
    return payload<Automated.Failed.MissingData>(message, 400, false, {
        error: 'Missing Requirements',
        missing: {
            possible,
            provided: Object.keys(provided),
            scope: name
        },
    });
}

export function unauthorized(): RoutePayload<Automated.Failed.Unauthorized> {
    return payload<Automated.Failed.Unauthorized>('Authentication failed.', 200, false, {
        error: 'Authorization Failed'
    });
}

export function paramAuthMismatch(): RoutePayload<Automated.Failed.Parse> {
    return payload<Automated.Failed.Parse>('Request params username does not match decoded header username', 200, false, {
        error: 'Authorization Header Parse',
        field: 'username param'
    });
}

export function noDatabaseConnection(): RoutePayload<Automated.Failed.Database.NoConnection> {
    return payload<Automated.Failed.Database.NoConnection>('No connection to database.', 200, false, { error: 'No Connection to Database' });
}

export function unknown(errorObject: Error): RoutePayload<Automated.Failed.Unknown> {
    return payload<Automated.Failed.Unknown>(`An error that not expected occurred: ${errorObject.message}`, 200, false, {
        error: 'Unknown',
        errorObject: {
            message: errorObject.message,
            name: errorObject.name
        }
    });
}
