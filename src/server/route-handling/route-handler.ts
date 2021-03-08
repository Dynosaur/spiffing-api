/* eslint-disable @typescript-eslint/no-explicit-any */

import { chalk } from 'tools/chalk';
import { Request } from 'express';
import { MissingDataError } from 'interface-bindings/error-responses';
import { DatabaseActions, RoutePayload, RouteHandler } from 'route-handling/route-infra';

export async function executeRouteHandler(
    request: Request,
    actions: DatabaseActions,
    handler: RouteHandler<any>,
    fingerprint: string,
    verbose = true
): Promise<void> {
    function sendPayload(request: Request, payload: RoutePayload<any>, verbose = true): void {
        request.res!.status(payload.code).send(payload.payload);
        if (verbose) {
            const message = `[${payload.code}] ${payload.message}`;
            if (payload.payload.ok) {
                chalk.lime(`${fingerprint} SUCCESS: ${message}`);
            } else {
                chalk.rust(`${fingerprint} FAILED: ${message}`);
            }
        }
    }
    if (verbose) {
        chalk.sky(`${fingerprint} Executing route handler "${handler.name}".`);
    }

    let routePayload: RoutePayload<any>;
    try {
        routePayload = await handler(request, actions);
        if (!routePayload) {
            chalk.red(`${fingerprint} ERROR: route handler "${handler.name}" returned null. Responding with error.`);
            request.res!.status(500).send({ status: 'ERROR', message: 'Route handler returned null.' });
        } else {
            sendPayload(request, routePayload, verbose);
        }
    } catch (error) {
        sendPayload(request, {
            code: 500,
            message: error.message,
            payload: { ok: false, error: error.message }
        }, verbose);
    }
    if (verbose) {
        console.log(''); // eslint-disable-line no-console
    }
}

export function scopeMustHaveProps(scope: Record<string, string>, scopeName: string, props: string[]): MissingDataError | undefined {
    const missing: string[] = [];
    for (const prop of props)
        if (!scope.hasOwnProperty(prop))
            missing.push(prop);
    if (missing.length)
        return new MissingDataError(scopeName, Object.keys(scope), missing);
    return undefined;
}
