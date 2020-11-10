import { Request } from 'express';
import { checkScope } from './check-scope';
import { DatabaseActions } from '../../database';
import { chalk, decodeBasicAuth } from '../../tools';
import { missingData, unauthorized } from './response-functions';
import { RoutePayload, RouteHandler, RouteHandlerRequirements } from './route-infra';

import { AuthenticateErrorResponse, MissingDataErrorResponse, UserExistsErrorResponse, UserNoExistErrorResponse } from '../interface/responses/error-responses';

export function routePayload<T>(httpCode: number, consoleMessage: string, payload: T): RoutePayload<T> {
    return { httpCode, consoleMessage, payload };
}

/**
 * A wrapper around a RouteHandler that executes it, sends the payload, and performs logging.
 */
export async function executeRouteHandler(
    request: Request,
    actions: DatabaseActions,
    checks: RouteHandlerFunctions,
    handler: RouteHandler,
    requirements?: RouteHandlerRequirements
): Promise<void> {
    const routeHandlerArgs: any = {};

    // Handle RouteHandler requirements
    if (requirements) {
        chalk.sky('Checking route handler requirements.');
        const presentHeaders: any = {};
        if (requirements.scope) {
            for (const scope of Object.keys(requirements.scope)) {
                const check = checkScope(requirements.scope[scope].required, requirements.scope[scope].replacements, request[scope], scope);
                if (check) {
                    sendPayload(request, check);
                    return;
                }
                presentHeaders[scope] = true;
            }
        }
        if (requirements.auth) {
            if (!presentHeaders.authorization) {
                const headerCheck = checkScope('authorization', {}, request.headers, 'headers');
                if (headerCheck) {
                    sendPayload(request, headerCheck);
                    return;
                }
            }
            const decoded = decodeBasicAuth(request.headers.authorization);
            if (decoded.status === 'error') {
                sendPayload(request, decoded.error);
                return;
            }
            if (requirements.auth.checkParamUsername) {
                if (request.params.username !== decoded.username) {
                    chalk.rust('Request failed authentication:\nRequest params username does not match decoded header username.');
                    request.res.status(400).send({ status: 'BAD_REQUEST' });
                    return;
                }
            }
            const authRes = await actions.authenticate(decoded.username, decoded.password);
            switch (requirements.auth.method) {
                case 'authenticate':
                    switch (authRes.status) {
                        case 'FAILED':
                        case 'NO_USER':
                            sendPayload(request, unauthorized());
                            return;
                        case 'OK':
                            break;
                    }
                case 'pass':
                    routeHandlerArgs.authentication = authRes.status;
                    break;
            }
            routeHandlerArgs.username = decoded.username;
            routeHandlerArgs.password = decoded.password;
        }
    } else {
        chalk.green('Route handler has no requirements.');
    }

    // Execute and catch errors
    chalk.sky(`Executing route handler "${handler.name}".`);
    let routePayload: RoutePayload<any>;
    try {
        routePayload = await handler(request, actions, checks, routeHandlerArgs);
    } catch (error) {
        chalk.red(`ERROR: route handler "${handler.name}" threw an error. Responding with default 500 error.`);
        chalk.red(error);
        request.res.status(500).send({ status: 'ERROR', message: 'An error occurred while responding to the request.', error });
    }

    // Send response
    if (!routePayload) {
        chalk.red(`ERROR: route handler "${handler.name}" returned null. Responding with error.`);
        request.res.status(500).send({ status: 'ERROR', message: 'Route handler returned null.' });
    } else {
        sendPayload(request, routePayload);
    }

    console.log('');  // Adds a newline between requests
}

function sendPayload(request: Request, payload: RoutePayload<any>): void {
    request.res.status(payload.httpCode).send(payload.payload);

    const message = `[${payload.httpCode}] ${payload.consoleMessage}`;
    if (payload.httpCode >= 100 && payload.httpCode <= 399) {
        chalk.lime(`SUCCESS: ${message}`);
    } else if (payload.httpCode >= 400 && payload.httpCode <= 599) {
        chalk.rust(`FAILED: ${message}`);
    } else {
        chalk.yellow(`UNKNOWN: ${message}`);
    }
}

export class RouteHandlerFunctions {

    constructor(private actions: DatabaseActions) { }

    async authenticate(request: Request): Promise<{
        state: 'error';
        error: RoutePayload<AuthenticateErrorResponse>;
    } | {
        state: 'ok';
        username: string;
        password: string;
    }> {
        const decoded = decodeBasicAuth(request.headers.authorization);
        if (decoded.status === 'error') {
            return { state: 'error', error: decoded.error };
        }

        const username = decoded.username;
        const password = decoded.password;

        if (request.params.username && request.params.username !== username) {
            return {
                state: 'error',
                error: {
                    consoleMessage: 'No solution: param username is not equal to decoded username.',
                    httpCode: 500,
                    payload: { status: 'E_UNAUTHORIZED' }
                }
            };
        }

        const operation = await this.actions.authenticate(username, password);
        switch (operation.status) {
            case 'FAILED':
                return { state: 'error', error: {
                    consoleMessage: 'Prerequisite authentication failed.',
                    httpCode: 403,
                    payload: { status: 'E_UNAUTHORIZED' }
                } };
            case 'NO_USER':
                return { state: 'error', error: {
                    consoleMessage: `Could not authenticate: user "${username}" does not exist.`,
                    httpCode: 404,
                    payload: { status: 'E_USER_NO_EXIST' }
                } };
            case 'OK':
                return { state: 'ok', username, password };
            default:
                throw new Error(`Unexpected operation state:\n${JSON.stringify(operation, null, 4)}`);
        }
    }

    // checkScope(params: string[], scope: any, name: string, require?: 'all' | 'one'): RoutePayload<MissingDataErrorResponse> {
    //     return checkScope(params, scope, name, require);
    // }

    async userMustNotExist(username: string): Promise<RoutePayload<UserExistsErrorResponse>> {
        const operation = await this.actions.readUser(username);
        switch (operation.status) {
            case 'NO_USER':
                return;
            case 'OK':
                return {
                    httpCode: 400,
                    consoleMessage: `Prerequisite user "${username}" must not exist failed.`,
                    payload: {
                        status: 'E_USER_EXISTS'
                    }
                };
            default:
                throw new Error(`Unexpected operation state:\n${JSON.stringify(operation, null, 4)}`);
        }
    }

    async userMustExist(username: string): Promise<RoutePayload<UserNoExistErrorResponse>> {
        const operation = await this.actions.readUser(username);
        switch (operation.status) {
            case 'NO_USER':
                return {
                    httpCode: 404,
                    consoleMessage: `Prerequisite user "${username}" must exist failed.`,
                    payload: {
                        status: 'E_USER_NO_EXIST'
                    }
                };
            case 'OK':
                return;
            default:
                throw new Error(`Unexpected operation state:\n${JSON.stringify(operation, null, 4)}`);
        }
    }
}
