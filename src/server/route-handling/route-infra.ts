import { Request } from 'express';
import { UserAPI } from 'database/dbi/user-api';
import { PostAPI } from 'database/dbi/post-actions';
import { HttpMethod } from 'server/routing';
import { CommentAPI } from 'database/dbi/comment-actions';
import { BaseResponse } from 'interface/response';
import { CommonActions } from 'database/common-actions';

export interface RoutePayload<T extends BaseResponse> {
    httpCode: number;
    consoleMessage: string;
    payload: T;
}

export interface DatabaseActions {
    comment: CommentAPI;
    common: CommonActions;
    post: PostAPI;
    user: UserAPI;
}

export interface RouteHandler<ResponseType extends BaseResponse> {
    (request: Request<any, ResponseType>, actions: DatabaseActions): Promise<RoutePayload<ResponseType>>
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
