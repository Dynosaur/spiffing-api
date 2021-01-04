import { chalk } from 'tools/chalk';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { checkScope } from 'server/route-handling/check-scope';
import { decodeBasicAuth } from 'tools/auth';
import { BoundUser, UserAPI } from 'app/database/dbi/user-api';
import { BoundPost, PostAPI } from 'app/database/dbi/post-actions';
import { objectIdParseErrorMessage } from 'app/error-messages';
import { DatabaseActions } from 'server/route-handling/route-infra';
import { RoutePayload, RouteHandler, RouteHandlerRequirements } from 'server/route-handling/route-infra';
import { ErrorResponse as IErrorResponse } from 'interface/response';
import { IMissingDataError, INoPostFoundError, INoUserFoundError, IObjectIdParseError } from 'interface/responses/error-responses';
import { MissingDataError, NoPostFoundError, NoUserFoundError, ObjectIdParseError } from '../interface-bindings/error-responses';

export async function executeRouteHandler(
    request: Request,
    actions: DatabaseActions,
    handler: RouteHandler<any>,
    fingerprint: string,
    requirements?: RouteHandlerRequirements,
    verbose = true): Promise<void> {
    function sendPayload(request: Request, payload: RoutePayload<any>, verbose = true): void {
        request.res.status(payload.httpCode).send(payload.payload);
        if (verbose) {
            const message = `[${payload.httpCode}] ${payload.consoleMessage}`;
            if (payload.payload.ok) {
                chalk.lime(`${fingerprint} SUCCESS: ${message}`);
            } else {
                chalk.rust(`${fingerprint} FAILED: ${message}`);
            }
        }
    }

    const routeHandlerArgs: any = {};

    if (requirements) {
        if (verbose) {
            chalk.sky(`${fingerprint} Checking route handler ${handler.name} requirements.`);
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
            if (decoded.ok === false) {
                sendPayload(request, decoded.error, verbose);
                return;
            }
            if (requirements.auth.checkParamUsername) {
                if (request.params.username !== decoded.username) {
                    // sendPayload(request, paramAuthMismatch(), verbose);
                    return;
                }
            }
            const authRes = await actions.common.authenticate(decoded.username, decoded.password);
            switch (requirements.auth.method) {
                case 'authenticate':
                    if (authRes.ok === false) {
                        // sendPayload(request, unauthorized(), verbose);
                        return;
                    }
                case 'pass':
                    routeHandlerArgs.authentication = authRes;
                    break;
            }
            routeHandlerArgs.username = decoded.username;
            routeHandlerArgs.password = decoded.password;
            if (authRes.ok === true) routeHandlerArgs.id = authRes.user._id;
        }
    } else if (verbose) {
        chalk.lime(`${fingerprint} Route handler has no requirements.`);
    }

    if (verbose) {
        chalk.sky(`${fingerprint} Executing route handler "${handler.name}".`);
    }

    let routePayload: RoutePayload<any>;
    try {
        routePayload = await handler(request, actions, routeHandlerArgs);
    } catch (error) {
        if (verbose) chalk.red(`ERROR: route handler "${handler.name}" threw an error: ${error.message}`);
        if (error.message === 'Topology is closed, please connect') {
            // sendPayload(request, noDatabaseConnection(), verbose);
            return;
        }
        // sendPayload(request, unknown(error), verbose);
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

type ERes<T extends IErrorResponse<string>> = (error: RoutePayload<T>) => void;

export function scopeMustHaveProps(resolve: ERes<IMissingDataError>, scope: object, scopeName: string, props: string[]): void {
    let missing: string[] = [];
    for (const prop of props)
        if (!scope.hasOwnProperty(prop))
            missing.push(prop);
    if (missing.length)
        resolve(new MissingDataError(scopeName, Object.keys(scope), props).toRoutePayload());
}

export function scopeMustHaveOneProp(resolve: ERes<IMissingDataError>, scope: object, scopeName: string, props: string[]): string {
    for (const prop of props)
        if (scope.hasOwnProperty(prop))
            return prop;
    resolve(new MissingDataError(scopeName, Object.keys(scope), props).toRoutePayload());
}

export function createObjectIdOrFail(resolve: ERes<IObjectIdParseError>, id: string): ObjectId {
    try {
        return new ObjectId(id);
    } catch (error) {
        if (error.message === objectIdParseErrorMessage)
            resolve(new ObjectIdParseError(id).toRoutePayload());
        else throw error;
    }
}

export async function getPostOrFail(resolve: ERes<INoPostFoundError>, postAPI: PostAPI, id: ObjectId): Promise<BoundPost> {
    const post = await postAPI.readPost(id);
    if (post === null)
        resolve(new NoPostFoundError(id.toHexString()).toRoutePayload());
    return post;
}

export async function getUserOrFail(resolve: ERes<INoUserFoundError>, userAPI: UserAPI, id: ObjectId | string): Promise<BoundUser> {
    let user: BoundUser;
    if (id instanceof ObjectId)
        user = await userAPI.readUser({ _id: id });
    else
        user = await userAPI.readUser({ username: id });
    if (user === null)
        resolve(new NoUserFoundError(id instanceof ObjectId ? id.toHexString() : id).toRoutePayload());
    return user;
}
