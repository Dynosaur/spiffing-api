import { Post, User } from '../data-types';
import { AuthenticateErrorResponse } from './error-responses';
import { ErrorResponse, OkResponse } from '../response';

export interface GetPostFoundResponse extends OkResponse {
    post: Post;
}
export interface GetPostErrorResponse extends ErrorResponse<'Post Not Found'> { }
export type GetPostEndpoint =
    GetPostErrorResponse |
    GetPostFoundResponse;

export interface CreatePostCreatedResponse extends OkResponse {
    post: Post;
}
export type CreatePostEndpoint =
    AuthenticateErrorResponse |
    CreatePostCreatedResponse;

export namespace GetUser {
    export namespace Failed {
        export interface UserNotFound extends ErrorResponse<'User Not Found'> { }
        export type Tx = UserNotFound;
    }

    export namespace Ok {
        export interface UserFound extends OkResponse {
            user: User;
        }
        export type Tx = UserFound;
    }

    export type Tx = Failed.Tx | Ok.Tx;
}

export namespace GetPosts {
    export interface PostsFound extends OkResponse {
        posts: Post[];
        'query-blocked'?: string[];
        'query-allowed'?: string[];
    }

    export type Tx = PostsFound;
}

export namespace CreatePost {
    export namespace Failed {
        export type Tx = AuthenticateErrorResponse;
    }

    export namespace Ok {
        export interface Created extends OkResponse {
            post: Post;
        }

        export type Tx = Created;
    }

    export type Tx = Failed.Tx | Ok.Tx;
}
