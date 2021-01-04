import { OkResponse } from '../response';
import { Post, User } from '../data-types';
import { AuthorizedRequestError, IMissingDataError, INoPostFoundError, INoUserFoundError, IObjectIdParseError } from './error-responses';

export namespace GetUser {
    export type ErrorTx = INoUserFoundError;

    export interface Success extends OkResponse {
        user: User;
    }

    export type Tx = ErrorTx | Success;
}

export namespace GetPosts {
    export type ErrorTx = INoPostFoundError | IObjectIdParseError;

    export interface Success extends OkResponse {
        posts: Post[];
        'query-blocked'?: string[];
        'query-allowed'?: string[];
    }

    export type Tx = ErrorTx | Success;
}

export namespace GetPost {
    export type ErrorTx = INoPostFoundError | IObjectIdParseError;

    export interface Success extends OkResponse {
        post: Post;
    }

    export type Tx = ErrorTx | Success;
}

export namespace CreatePost {
    export type ErrorTx = AuthorizedRequestError | IMissingDataError | IObjectIdParseError;

    export interface Success extends OkResponse {
        post: Post;
    }

    export type Tx = ErrorTx | Success;
}

export namespace RatePost {
    export type ErrorTx = AuthorizedRequestError | IMissingDataError | INoPostFoundError | IObjectIdParseError;

    export interface Success extends OkResponse { }

    export type Tx = ErrorTx | Success;
}
