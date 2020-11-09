import { Request } from 'express';
import { RouteHandlerFunctions } from './route-handler';
import { DatabaseActions } from '../../database/database-actions';

export interface RoutePayload<T> {
    httpCode: number;
    consoleMessage: string;
    payload: T;
}

export type RouteHandler<ResponseType = any> = (
    request: Request<any, ResponseType>,
    actions: DatabaseActions,
    checks: RouteHandlerFunctions,
    args: any
) => Promise<RoutePayload<ResponseType>>;

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
    method: string;
    path: string;
    handler: RouteHandler;
    requirements?: RouteHandlerRequirements;
}
