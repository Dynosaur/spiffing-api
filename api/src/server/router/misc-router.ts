import { RouteHandler, RouteInfo, RoutePayload } from 'server/route-handling/route-infra';

const indexRoute: RouteHandler<any> = async () => {
    return new RoutePayload('Pinged index page.', {
        message: 'Hello!',
        ok: true
    });
};

export const routes: RouteInfo[] = [
    { method: 'GET', path: '/', handler: indexRoute }
];
