import { chalk } from 'tools/chalk';
import { Request } from 'express';
import { checkScope } from 'server/route-handling/check-scope';
import { unauthorized } from 'server/route-handling/response-functions';
import { decodeBasicAuth } from 'tools/auth';
import { DatabaseActions } from 'database/database-actions';
import { AuthenticateErrorResponse, AuthParseErrorResponse } from 'interface/responses/error-responses';
import { RegisterUserExistsErrorResponse } from 'interface/responses/auth-endpoints';
import { RoutePayload, RouteHandler, RouteHandlerRequirements, payload } from 'server/route-handling/route-infra';

export async function executeRouteHandler(
    request: Request,
    actions: DatabaseActions,
    checks: RouteHandlerFunctions,
    handler: RouteHandler<any>,
    requirements?: RouteHandlerRequirements,
    verbose = true
): Promise<void> {
    const routeHandlerArgs: any = {};

    if (requirements) {
        if (verbose) {
            chalk.sky('Checking route handler requirements.');
        }
        const presentHeaders: any = {};
        if (requirements.scope) {
            for (const scope of Object.keys(requirements.scope)) {
                const check = checkScope(requirements.scope[scope].required, requirements.scope[scope].replacements, request[scope], scope);
                if (check) {
                    sendPayload(request, check, verbose);
                    return;
                }
                presentHeaders[scope] = true;
            }
        }
        if (requirements.auth) {
            if (!presentHeaders.authorization) {
                const headerCheck = checkScope('authorization', {}, request.headers, 'headers');
                if (headerCheck) {
                    sendPayload(request, headerCheck, verbose);
                    return;
                }
            }
            const decoded = decodeBasicAuth(request.headers.authorization);
            if (decoded.status === 'error') {
                sendPayload(request, decoded.error, verbose);
                return;
            }
            if (requirements.auth.checkParamUsername) {
                if (request.params.username !== decoded.username) {
                    if (verbose) {
                        chalk.rust('Request failed authentication:\nRequest params username does not match decoded header username.');
                    }
                    request.res.status(400).send({ status: 'BAD_REQUEST' });
                    return;
                }
            }
            const authRes = await actions.authenticate(decoded.username, decoded.password);
            switch (requirements.auth.method) {
                case 'authenticate':
                    if (!authRes) {
                        sendPayload(request, unauthorized(), verbose);
                        return;
                    }
                case 'pass':
                    routeHandlerArgs.authentication = authRes;
                    break;
            }
            routeHandlerArgs.username = decoded.username;
            routeHandlerArgs.password = decoded.password;
        }
    } else if (verbose) {
        chalk.green('Route handler has no requirements.');
    }

    if (verbose) {
        chalk.sky(`Executing route handler "${handler.name}".`);
    }

    let routePayload: RoutePayload<any>;
    try {
        routePayload = await handler(request, actions, checks, routeHandlerArgs);
    } catch (error) {
        if (verbose) {
            chalk.red(`ERROR: route handler "${handler.name}" threw an error. Responding with default 500 error.`);
            chalk.red(error);
        }
        request.res.status(500).send({ status: 'ERROR', message: 'An error occurred while responding to the request.', error });
        return;
    }

    if (!routePayload) {
        chalk.red(`ERROR: route handler "${handler.name}" returned null. Responding with error.`);
        request.res.status(500).send({ status: 'ERROR', message: 'Route handler returned null.' });
    } else {
        sendPayload(request, routePayload, verbose);
    }

    if (verbose) {
        console.log(''); // eslint-disable-line
    }
}

function sendPayload(request: Request, payload: RoutePayload<any>, verbose = true): void {
    request.res.status(payload.httpCode).send(payload.payload);

    if (verbose) {
        const message = `[${payload.httpCode}] ${payload.consoleMessage}`;
        if (payload.httpCode >= 100 && payload.httpCode <= 399) {
            chalk.lime(`SUCCESS: ${message}`);
        } else if (payload.httpCode >= 400 && payload.httpCode <= 599) {
            chalk.rust(`FAILED: ${message}`);
        } else {
            chalk.yellow(`UNKNOWN: ${message}`);
        }
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
                error: payload<AuthParseErrorResponse>('No solution: param username is not equal to decoded username.', 500, false, {
                    error: 'Authorization Header Parse',
                    field: 'username param'
                })
            };
        }

        const authRes = await this.actions.authenticate(username, password);
        if (authRes) {
            return {
                state: 'ok',
                username,
                password
            };
        } else {
            return {
                state: 'error',
                error: payload<AuthenticateErrorResponse>('Prerequisite authentication failed', 401, false, null)
            };
        }
    }

    async userMustNotExist(username: string): Promise<RoutePayload<RegisterUserExistsErrorResponse>> {
        const user = await this.actions.readUser(username);
        if (user) {
            return payload<RegisterUserExistsErrorResponse>(`Prerequisite user "${username}" must not exist failed.`, 400, false, {
                error: 'User Already Exists'
            });
        } else {
            return null;
        }
    }
}
