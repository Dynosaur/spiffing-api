import { payload, RouteInfo } from 'server/route-handling/route-infra';

export const indexRoute: RouteInfo = {
    handler: async () => {
        return payload<any>('Pinged index page.', 200, true, { message: 'Hello!' });
    },
    method: 'GET',
    path: '/'
};
