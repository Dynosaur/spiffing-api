import { IOkResponse } from '../response';
import { Post, RatedPosts, User } from '../data-types';
import { AuthorizedRequestError, IAuthHeaderIdParamMismatchError, IMissingDataError, INoPostFoundError, INoUserFoundError, IObjectIdParseError } from './error-responses';

export namespace IGetUser {
    export type ErrorTx = INoUserFoundError;

    export interface Success extends IOkResponse {
        user: User;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IGetPosts {
    export type ErrorTx = INoPostFoundError | IObjectIdParseError;

    export interface Success extends IOkResponse {
        posts: Post[];
        'query-blocked'?: string[];
        'query-allowed'?: string[];
    }

    export type Tx = ErrorTx | Success;
}

export namespace IGetPost {
    export type ErrorTx = INoPostFoundError | IObjectIdParseError;

    export interface Success extends IOkResponse {
        post: Post;
    }

    export type Tx = ErrorTx | Success;
}

export namespace ICreatePost {
    export type ErrorTx = AuthorizedRequestError | IMissingDataError | IObjectIdParseError;

    export interface Success extends IOkResponse {
        post: Post;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IRatePost {
    export type ErrorTx = AuthorizedRequestError | IMissingDataError | INoPostFoundError | IObjectIdParseError;

    export interface Success extends IOkResponse { }

    export type Tx = ErrorTx | Success;
}

export namespace IGetRatedPosts {
    export type ErrorTx = AuthorizedRequestError | INoUserFoundError | IAuthHeaderIdParamMismatchError;

    export interface Success extends IOkResponse {
        ratedPosts: RatedPosts;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IGetUsers {
    export type ErrorTx = IMissingDataError;

    export interface Success extends IOkResponse {
        users: User[];
        missing: string[];
    }

    export type Tx = ErrorTx | Success;
}
