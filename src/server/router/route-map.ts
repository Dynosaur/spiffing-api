import { deleteUser }  from 'router/delete-user';
import { getComments } from 'router/get-comments';
import { ratePost }    from 'router/rate-post';
import { RouteInfo }   from 'route-handling/route-infra';

export const routes: RouteInfo[] = [
    { method: 'GET',    path: '/comments',      handler: getComments },
    { method: 'DELETE', path: '/user',          handler: deleteUser  },
    { method: 'POST',   path: '/rate/post/:id', handler: ratePost    },
];
