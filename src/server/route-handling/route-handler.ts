import { chalk } from 'tools/chalk';
import { Request } from 'express';
import { MissingDataError } from 'interface-bindings/error-responses';
import { DatabaseActions, RoutePayload, RouteHandler } from 'route-handling/route-infra';

export async function executeRouteHandler(
    request: Request,
    actions: DatabaseActions,
    handler: RouteHandler<any>,
    fingerprint: string,
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
    if (verbose) {
        chalk.sky(`${fingerprint} Executing route handler "${handler.name}".`);
    }

    let routePayload: RoutePayload<any>;
    try {
        routePayload = await handler(request, actions);
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

export function scopeMustHaveProps(scope: object, scopeName: string, props: string[]): MissingDataError {
    let missing: string[] = [];
    for (const prop of props)
        if (!scope.hasOwnProperty(prop))
            missing.push(prop);
    if (missing.length)
        return new MissingDataError(scopeName, Object.keys(scope), props);
}
