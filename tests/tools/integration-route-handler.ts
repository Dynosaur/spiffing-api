import { DatabaseActions } from '../../src/database';
import { executeRouteHandler } from '../../src/server/route-handling/route-handler';
import { RouteInfo } from '../../src/server/route-handling/route-infra';
import { MockPrereqs } from './route-handler';

export async function runExec(mock: MockPrereqs, info: RouteInfo): Promise<void> {
    await executeRouteHandler(
        mock.req as any,
        new DatabaseActions(mock.users as any, mock.posts as any),
        mock.fns as any,
        info.handler,
        info.requirements
    );
}
