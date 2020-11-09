import { DatabaseActions } from '../../src/database/database-actions';
import { RouteHandlerFunctions } from '../../src/server/route-handling/route-handler';
import { RouteHandler, RoutePayload } from '../../src/server/route-handling/route-infra';
import { MockRequest, MockChecks, MockUserCollection, MockPostCollection } from '../mock';

export interface MockPrereqs<T = any> {
    req: MockRequest<T>;
    fns: MockChecks;
    users: MockUserCollection;
    posts: MockPostCollection;
}

export function createMocks<T>(fillUser = 0, fillPosts = 0): MockPrereqs<T> {
    return {
        req: new MockRequest<T>(),
        fns: new MockChecks(),
        users: new MockUserCollection(fillUser),
        posts: new MockPostCollection(fillPosts)
    };
}

export async function runRouteHandler<T>(handler: RouteHandler<T>, mock: MockPrereqs<T>, args: any = {}): Promise<RoutePayload<T>> {
    const actions = new DatabaseActions(mock.users as any, mock.posts as any);
    return handler(mock.req as any, actions, new RouteHandlerFunctions(actions), args);
}
