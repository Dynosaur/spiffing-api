import { RouteInfo, RoutePayload } from 'server/route-handling/route-infra';

export const indexRoute: RouteInfo = {
    handler: async () => {
        return new RoutePayload('Pinged index page.', {
            message: 'Hello!',
            ok: true
        });
    },
    method: 'GET',
    path: '/'
};
