import { Request } from 'express';
import { CommentAPI }    from 'database/comment';
import { CommonActions } from 'database/common-actions';
import { UserAPI }       from 'database/user';
import { PostAPI }       from 'database/post';
import { IBaseResponse } from 'interface/response';
import { HttpMethod }    from 'server/server';

export class RoutePayload<PayloadType extends IBaseResponse> {
    constructor(public message: string, public payload: PayloadType, public code = 200) {}
}

export interface DatabaseActions {
    comment: CommentAPI;
    common: CommonActions;
    post: PostAPI;
    user: UserAPI;
}

export type RouteHandler<Tx extends IBaseResponse> = (request: Request<any, Tx>, actions: DatabaseActions) => Promise<RoutePayload<Tx>>;

export interface Route {
    method: HttpMethod;
    path: string;
}

export interface HandlerRoute extends Route {
    handler: RouteHandler<IBaseResponse>;
}

export interface StreamRoute extends Route {
    streamHandler: (request: Request, verbose: boolean, id: string) => void;
}


export type RouteInfo = HandlerRoute | StreamRoute;

export function isHandlerRoute(info: RouteInfo): info is HandlerRoute {
    return (info as HandlerRoute).handler !== undefined;
}

export function getNameOfRouteInfo(info: RouteInfo): string {
    return isHandlerRoute(info) ? info.handler.name : info.streamHandler.name;
}
