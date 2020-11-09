import { RouteInfo } from '../../../src/server/route-handling/route-infra';
import { MockRequest } from '../mock-request';
import { DatabaseActions } from '../../../src/database';
import { executeRouteHandler, RouteHandlerFunctions } from '../../../src/server/route-handling/route-handler';
import { MockPostCollection, MockUserCollection } from '../database';

export interface MockPrereqs<T = any> {
    req: MockRequest<T>;
    users: MockUserCollection;
    posts: MockPostCollection;
}

export function createMocks<T>(fillUser = 0, fillPosts = 0): MockPrereqs<T> {
    return {
        req: new MockRequest<T>(),
        users: new MockUserCollection(fillUser),
        posts: new MockPostCollection(fillPosts)
    };
}

export async function runExecuteRouteHandler(mock: MockPrereqs, info: RouteInfo): Promise<void> {
    const actions = new DatabaseActions(mock.users as any, mock.posts as any);
    await executeRouteHandler(
        mock.req as any,
        actions,
        new RouteHandlerFunctions(actions),
        info.handler,
        info.requirements
    );
}
