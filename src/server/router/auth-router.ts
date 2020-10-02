import { Request } from 'express';
import { ExportedRoutes, HandlerReply, ResourceManager } from '../server';
import { checkScope, decodeBasicAuth, reply, sendMissingParameter } from '../../tools';

// Do away with the typeCheck thing, I think it is redundant
async function register(request: Request, rsrc: ResourceManager): Promise<HandlerReply> {
    const check = checkScope(request.headers, ['authorization']);
    if (!check.ok) {
        return sendMissingParameter(check.param, 'headers');
    }

    const isRegisterTest = request.query.test;

    const decoded = decodeBasicAuth(request.headers.authorization);
    if (!decoded.success) {
        const message = `Could not extract ${decoded.error} from Authorization header.`;
        return reply(500, message, 'REJECTED');
    }
    const username = decoded.username;
    const password = decoded.password;

    const isUsernameUnique = await rsrc.user.isUsernameUnique(username);
    if (!isUsernameUnique) {
        const message = `Username "${username}" is taken.`;
        return {
            httpCode: 400, message, payload: {
                status: 'REJECTED', message
            }
        }
    }

    if (isRegisterTest) {
        return reply(200, 'Successful test request, no account created.', 'OK');
    } else {
        await rsrc.user.create(username, password);
        const data = await rsrc.user.getUserNoPassword(username);
        const message = `Successfully created new user "${username}"`
        return reply(201, message, 'CREATED', { data });
    }
}

async function authenticate(request: Request, rsrc: ResourceManager): Promise<HandlerReply> {
    const check = checkScope(request.headers, ['authorization']);
    if (!check.ok) {
        return sendMissingParameter(check.param, 'headers');
    }

    const decoded = decodeBasicAuth(request.headers.authorization);
    if (!decoded.success) {
        const message = `Could not extract ${decoded.error} from Authorization header.`;
        return reply(500, message, 'MALFORMED');
    }
    const username = decoded.username;
    const password = decoded.password;

    const user = await rsrc.user.getOne(username);
    if (user && password === user.password) {
        return reply(200, 'Successful authentication.', 'OK');
    } else {
        return reply(400, 'Unsuccessful authentication.', 'REJECTED');
    }
}

export function authRoutes(): ExportedRoutes {
    return [
        { method: 'POST', path: '/api/register',     handler: register },
        { method: 'POST', path: '/api/authenticate', handler: authenticate }
    ];
}
