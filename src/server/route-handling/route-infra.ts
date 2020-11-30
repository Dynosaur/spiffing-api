import { Request } from 'express';
import { Response } from 'interface/response';
import { HttpMethod } from 'app/server/routing';
import { DatabaseActions } from 'database/database-actions';
import { RouteHandlerFunctions } from './route-handler';

export interface RoutePayload<T extends Response> {
    httpCode: number;
    consoleMessage: string;
    payload: T;
}

export function payload<T extends Response>(message: string, code: number, ok: T['ok'], payload: Omit<T, 'ok'>): RoutePayload<T> {
    return {
        consoleMessage: message,
        httpCode: code,
        payload: {
            ok,
            ...payload as any
        }
    };
}

export interface RouteHandler<ResponseType extends Response> {
    (request: Request<any, ResponseType>, actions: DatabaseActions, checks: RouteHandlerFunctions, args: any): Promise<RoutePayload<ResponseType>>
}

export type RequiredParam = { param: string; strategy?: 'AND' | 'OR'; } | { param: string; strategy: 'REPLACE'; replacement: any; };

export interface RequiredScope {
    required: string | string[] | string[][];
    replacements: object;
}

export interface RouteHandlerRequirements {
    scope?: {
        body?:    RequiredScope;
        headers?: RequiredScope;
        params?:  RequiredScope;
        query?:   RequiredScope;
    };
    auth?: {
        checkParamUsername?: boolean;
        method: 'authenticate' | 'pass';
    };
};

export interface RouteInfo {
    method: HttpMethod;
    path: string;
    handler: RouteHandler<any>;
    requirements?: RouteHandlerRequirements;
}
