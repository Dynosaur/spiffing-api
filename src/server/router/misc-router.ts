import { RouteInfo } from 'server/route-handling/route-infra';

export const indexRoute: RouteInfo = {
    handler: async () => {
        return {
            consoleMessage: 'Pinged index page.',
            httpCode: 200,
            ok: true,
            payload: { message: 'Hello!' }
        };
    },
    method: 'GET',
    path: '/'
};
