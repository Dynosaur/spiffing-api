import { IOkResponse } from '../response';
import { Post, RatedPosts, User, Comment } from '../data-types';
import {
    IMissingDataError,
    INoPostFoundError,
    INoUserFoundError,
    IIllegalValueError,
    IObjectIdParseError,
    INoCommentFoundError,
    AuthorizedRequestError,
    IAuthHeaderIdParamMismatchError
} from './error-responses';

export namespace IGetPosts {
    export type ErrorTx = INoPostFoundError | IObjectIdParseError;

    export interface Success extends IOkResponse {
        posts: Post[];
        failed?: any;
        'query-blocked'?: string[];
        'query-allowed'?: string[];
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
    export type ErrorTx = IMissingDataError | IObjectIdParseError;

    export interface Success extends IOkResponse {
        users: User[];
        'allowed-queries'?: string[];
        'blocked-queries'?: string[];
    }

    export type Tx = ErrorTx | Success;
}

export namespace IPostComment {
    export type ErrorTx = AuthorizedRequestError | INoPostFoundError | IMissingDataError |
    INoCommentFoundError | IIllegalValueError;

    export interface Success extends IOkResponse {
        comment: Comment;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IDeleteComment {
    export type ErrorTx = AuthorizedRequestError | INoCommentFoundError;

    export interface Success extends IOkResponse {
        fullyDeleted: boolean;
    }

    export type Tx = ErrorTx | Success;
}
