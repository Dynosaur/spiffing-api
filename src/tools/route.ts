import { Response } from '../server/interface';
import { HandlerReply, RouteHandlerResponse } from '../server/server';

export function reply<T extends Response>(httpCode: number, message: string, status: T['status'], etc?: object): HandlerReply {
    const payload = { status, message };
    Object.assign(payload, etc);
    return { httpCode, message, payload };
}

export function checkScope(scope: object, params: string[]): { ok: boolean, param: string } {
    for (let param of params) {
        if (scope[param] === undefined || scope[param] === null) {
            return { ok: false, param };
        }
    }
    return { ok: true, param: null };
}

export function sendMissingParameter(parameter: string, scope: string): HandlerReply {
    const message = 'Missing parameter ' + parameter + ' in request ' + scope + '.';
    return { httpCode: 400, message, payload: {
        status: 'INCOMPLETE', message, data: { parameter, scope }
    }};
}

export function writeResponse<T>(httpCode: number, message: string, payload: T): HandlerReply {
    return { httpCode, message, payload };
}
