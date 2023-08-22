import { DatabaseActions, RouteHandler, RoutePayload } from 'route-handling/route-infra';
import { Request } from 'express';
import { chalk } from 'tools/chalk';

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
            request.res!.status(500).send({ message: 'Route handler returned null.', status: 'ERROR' });
        } else {
            sendPayload(request, routePayload, verbose);
        }
    } catch (error) {
        sendPayload(request, {
            code: 500,
            message: error.message,
            payload: { error: error.message, ok: false }
        }, verbose);
    }
    if (verbose) {
        console.log(''); // eslint-disable-line no-console
    }
}
