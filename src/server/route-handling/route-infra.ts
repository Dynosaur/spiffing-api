import { Request } from 'express';
import { UserAPI } from 'app/database/user/api';
import { PostAPI } from 'app/database/post/api';
import { HttpMethod } from 'server/server';
import { CommentAPI } from 'database/comment/api';
import { IBaseResponse } from 'interface/response';
import { CommonActions } from 'database/common-actions';

export class RoutePayload<PayloadType extends IBaseResponse> {
    constructor(public message: string, public payload: PayloadType, public code = 200) { }
}

export interface DatabaseActions {
    comment: CommentAPI;
    common: CommonActions;
    post: PostAPI;
    user: UserAPI;
}

export interface RouteHandler<ResponseType extends IBaseResponse> {
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
    handler: RouteHandler<IBaseResponse>;
    stream?: boolean;
    streamHandler?: (request: Request, verbose: boolean, id: string) => void;
}
