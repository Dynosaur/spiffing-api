import { MockChecks, MockRequest, MockResources } from '../../mock';
import { RouteHandler, RoutePayload } from '../../../src/server/route-handling/route-infra';
import { MockCollection } from '../../mock/database/mock-collection';
import { DatabaseActions, DbPost, DbUser } from '../../../src/database/database-actions';
import { Post } from '../../../src/server/interface';
import { RouteHandlerFunctions } from '../../../src/server/route-handling/route-handler';

export interface MockPrereqs {
    req: MockRequest;
    rsrc: MockResources;
    fns: MockChecks;
    users: MockCollection<DbUser>;
    posts: MockCollection<DbPost>;
}

export function createMockRequestPrereqs(): MockPrereqs {
    return {
        req: new MockRequest(),
        rsrc: new MockResources(),
        fns: new MockChecks(),
        users: new MockCollection<DbUser>(),
        posts: new MockCollection<DbPost>()
    };
}

export async function runRouteHandler<T>(handler: RouteHandler<T>, mocks: MockPrereqs, args: any = {}): Promise<RoutePayload<T>> {
    const actions = new DatabaseActions(mocks.users as any, mocks.posts as any);
    return handler(mocks.req as any, actions, new RouteHandlerFunctions(actions), args);
}
