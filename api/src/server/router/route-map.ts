import { RouteInfo } from '../route-handling/route-infra';
import { route as authorize } from './authorize';
import { route as createComment } from './comment/create';
import { route as createPost } from './post/create';
import { route as createUser } from './user/create';
import { route as deleteComment } from './comment/delete';
import { route as deletePost } from './post/delete';
import { route as deleteUser } from './user/delete';
import { route as getComments } from './comment/get';
import { route as getPost } from './post/get';
import { route as getRate } from './rate/get';
import { route as getUser } from './user/get';
import { route as rateComment } from './rate/comment';
import { route as ratePost } from './rate/post';
import { route as updateUser } from './user/update';

export const routes: RouteInfo[] = [
    createComment, deleteComment, getComments,
    createPost, deletePost, getPost,
    getRate, rateComment, ratePost,
    createUser, deleteUser, getUser, updateUser,
    authorize
];
