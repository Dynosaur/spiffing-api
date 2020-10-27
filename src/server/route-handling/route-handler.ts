import { Request } from 'express';
import { DatabaseActions } from '../../database';
import { chalk, decodeBasicAuth } from '../../tools';
import { missingData } from './response-functions';

import { AuthenticateErrorResponse, MissingDataErrorResponse, UserExistsErrorResponse, UserNoExistErrorResponse } from '../interface/responses/error-responses';

export interface RoutePayload<T> {
    httpCode: number;
    consoleMessage: string;
    payload: T;
}

export type ExportedRoutes = Array<{
    method: string;
    path: string;
    handler: RouteHandler;
    requirements?: RouteHandlerRequirements;
}>;

/**
 * A function that, given a request to a route, will interpret it and form a response.
 */
export type RouteHandler<Tx = any, Rx = any> = (request: Request<any, Tx, Rx>, rsrc: DatabaseActions, checks: RouteHandlerFunctions) => Promise<RoutePayload<Tx>>;

export interface RouteHandlerRequirements {
    auth?: boolean;
    user?: {
        must?: 'exist' | 'not exist';
    },
    body?: {
        content: string | string[];
        require: 'all' | 'one';
    }
}

export function routePayload<T>(httpCode: number, consoleMessage: string, payload: T): RoutePayload<T> {
    return { httpCode, consoleMessage, payload };
}

/**
 * A wrapper around a RouteHandler that executes it, sends the payload, and performs logging.
 */
export async function executeRouteHandler(request: Request, actions: DatabaseActions, checks: RouteHandlerFunctions, handler: RouteHandler): Promise<void> {
    chalk.sky(`Executing route handler "${handler.name}".`);
    let routePayload: RoutePayload<any>;
    try {
        routePayload = await handler(request, actions, checks);
    } catch (error) {
        chalk.red(`ERROR: route handler "${handler.name}" threw an error. Responding with default 500 error.`);
        chalk.red(error);
        request.res.status(500).send({ status: 'ERROR', message: 'An error occurred while responding to the request.', error });
    }
    if (!routePayload) {
        chalk.red(`ERROR: route handler "${handler.name}" returned null. Responding with error.`);
        request.res.status(500).send({ status: 'ERROR', message: 'Route handler returned null.' });
    } else {
        request.res.status(routePayload.httpCode).send(routePayload.payload);
        const message = `[${routePayload.httpCode}] ${routePayload.consoleMessage}`;
        if (routePayload.httpCode < 100 || routePayload.httpCode > 600) {
            console.log('UNKNOWN: ' + message);
        } else if (routePayload.httpCode < 200) {
            chalk.yellow('UNKNOWN: ' + routePayload.consoleMessage);
        } else if (routePayload.httpCode < 300) {
            chalk.lime('SUCCESS: ' + routePayload.consoleMessage);
        } else {
            chalk.rust('FAILED: ' + routePayload.consoleMessage);
        }
    }
    console.log();  // Adds a newline between requests
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
        const scopeCheck = this.checkScope(['authorization'], request.headers, 'headers');
        if (scopeCheck) {
            return {
                state: 'error',
                error: scopeCheck
            };
        }

        const decoded = decodeBasicAuth(request.headers.authorization);
        if (decoded.errorResp) { return { state: 'error', error: decoded.errorResp }; }

        const username = decoded.username;
        const password = decoded.password;

        if (request.params.username && request.params.username !== username) {
            return {
                state: 'error',
                error: null
            };
        }

        const operation = await this.actions.authenticate(username, password);
        switch (operation.status) {
            case 'FAILED':
                return { state: 'error', error: {
                    consoleMessage: `Prerequisite authentication failed.`,
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

    checkScope(params: string[], scope: any, name: string, require?: 'all' | 'one'): RoutePayload<MissingDataErrorResponse> {
        if (!require) {
            require = 'all';
        }
        if (!scope || Object.keys(scope).length === 0) {
            chalk.orange(`WARNING: request "${name}" is undefined or empty!`);
        }

        const missing: string[] = [];
        for (const param of params) {
            switch (require) {
                case 'all':
                    if (!scope[param]) {
                        missing.push(param);
                    }
                    break;
                case 'one':
                    if (scope[param]) {
                        return null;
                    }
                    break;
                default:
                    throw new Error(`Unexpected require: "${require}".`);
            }
        }

        if (scope.require === 'all' && missing.length) {
            return missingData(missing, scope.name);
        }

        return null;
    }

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
