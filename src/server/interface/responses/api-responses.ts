import { Post, Rates, User, Comment }  from '../data-types';
import { IErrorResponse, IOkResponse } from '../response';
import {
    AuthorizedRequestError,
    IAuthHeaderIdParamMismatchError,
    IIllegalValueError,
    IMissingDataError,
    INoCommentFoundError,
    INoPostFoundError,
    INoUserFoundError,
    IObjectIdParseError,
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

    export interface Success extends IOkResponse {}

    export type Tx = ErrorTx | Success;
}

export namespace IGetRatedPosts {
    export type ErrorTx = AuthorizedRequestError | INoUserFoundError | IAuthHeaderIdParamMismatchError;

    export interface Success extends IOkResponse {
        ratedPosts: Rates;
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
    INoCommentFoundError | IIllegalValueError | IObjectIdParseError;

    export interface Success extends IOkResponse {
        comment: Comment;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IDeleteComment {
    export type ErrorTx = AuthorizedRequestError | INoCommentFoundError | IObjectIdParseError;

    export interface Success extends IOkResponse {
        fullyDeleted: boolean;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IGetComments {
    export interface IInvalidInputError extends IErrorResponse<'Invalid Input'> {
        allowed: string | string[];
        context: 'params';
        key: string;
        provided: string;
    }

    export type ErrorTx = IInvalidInputError | IMissingDataError | IObjectIdParseError;

    export interface Success extends IOkResponse {
        comments: Comment[];
        acceptedParams?: string[];
        ignoredParams?: string[];
        includeSuccessful?: boolean;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IRateComment {
    export type ErrorTx =
        | AuthorizedRequestError
        | IMissingDataError
        | INoCommentFoundError
        | IObjectIdParseError;

    export interface Success extends IOkResponse {
        change: boolean;
    }

    export type Tx = ErrorTx | Success;
}
