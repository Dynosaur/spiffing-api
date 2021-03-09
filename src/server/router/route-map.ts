import { getComments } from 'router/get-comments';
import { RouteInfo }   from 'route-handling/route-infra';
import { deleteUser } from 'router/delete-user';

export const routes: RouteInfo[] = [
    { method: 'GET',    path: '/comments', handler: getComments },
    { method: 'DELETE', path: '/user',     handler: deleteUser  }
];
