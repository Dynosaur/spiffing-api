import { User, Post } from '../data-types';
import { AuthenticateErrorResponse } from './error-responses';
import { ErrorResponse, SuccessfulResponse } from '../response';

export interface GetUserFoundResponse extends SuccessfulResponse {
    ok: true;
    user: User;
}
export interface GetUserErrorResponse extends ErrorResponse<'User Not Found'> { }
export type GetUserEndpoint =
    GetUserErrorResponse |
    GetUserFoundResponse;


export interface GetPostsEndpoint extends SuccessfulResponse {
    ok: true;
    posts: Post[];
}

export interface GetPostFoundResponse extends SuccessfulResponse {
    post: Post;
}
export interface GetPostErrorResponse extends ErrorResponse<'Post Not Found'> { }
export type GetPostEndpoint =
    GetPostErrorResponse |
    GetPostFoundResponse;

export interface CreatePostCreatedResponse extends SuccessfulResponse {
    post: Post;
}
export type CreatePostEndpoint =
    AuthenticateErrorResponse |
    CreatePostCreatedResponse;
