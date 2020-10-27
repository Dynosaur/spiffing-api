import { Response } from '../response';
import { User, Post } from '../data-types';
import { AuthenticateErrorResponse } from './error-responses';

export interface GetUserSuccessResponse extends Response<'OK'> {
    user: User;
}

export type GetUserEndpoint =
    GetUserSuccessResponse |
    Response<'NOT_FOUND'>;

export interface GetPostsEndpoint extends Response<'OK'> {
    posts: Post[];
}

export type GetPostEndpoint = {
    status: 'OK';
    post: Post;
} | {
    status: 'NOT_FOUND';
};

export type CreatePostEndpoint = {
    status: 'CREATED';
} | AuthenticateErrorResponse;
