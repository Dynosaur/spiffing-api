import { Automated } from './error-responses';
import { Post, User } from '../data-types';
import { ErrorResponse, OkResponse } from '../response';

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

export namespace GetPost {
    export namespace Failed {
        export interface NoPost extends ErrorResponse<'Post Not Found'> { }

        export interface IDParse extends ErrorResponse<'Could Not Parse ID'> { }

        export type Tx = IDParse | NoPost;
    }

    export namespace Ok {
        export interface FoundPost extends OkResponse {
            post: Post;
        }

        export type Tx = FoundPost;
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
        export interface Parse extends ErrorResponse<'Parsing Error'> {
            path: object;
        }

        export type Tx = Automated.Tx | Parse;
    }

    export namespace Ok {
        export interface Created extends OkResponse {
            post: Post;
        }

        export type Tx = Created;
    }

    export type Tx = Failed.Tx | Ok.Tx;
}

export namespace RatePost {
    export namespace Failed {
        export interface NoPost extends ErrorResponse<'No Post'> { }

        export type Tx = Automated.Tx | NoPost;
    }

    export interface Ok extends OkResponse { }

    export type Tx = Failed.Tx | Ok;
}
