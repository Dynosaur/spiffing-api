import { User } from '../data-types';
import { ErrorResponse, OkResponse } from '../response';
import { AuthorizedRequestError, IAuthHeaderIdParamMismatchError, IAuthorizationParseError,
INoUserFoundError, IObjectIdParseError, IUnauthenticatedError } from './error-responses';

export namespace IRegister {
    export namespace Failed {
        export interface UserExists extends ErrorResponse<'User Already Exists'> { }
        export type Tx = IAuthorizationParseError | IUnauthenticatedError | UserExists;
    }

    export interface Success extends OkResponse {
        user: User;
    }

    export type Tx = Failed.Tx | Success;
}

export namespace IAuthorize {
    export type ErrTx = AuthorizedRequestError | IAuthHeaderIdParamMismatchError;

    export interface Success extends OkResponse { }

    export type Tx = ErrTx | Success;
}

export namespace IDeregister {
    export type ErrTx = AuthorizedRequestError | IAuthHeaderIdParamMismatchError | INoUserFoundError | IObjectIdParseError;

    export interface Success extends OkResponse { }

    export type Tx = ErrTx | Success;
}

export namespace IPatch {
    export type ErrTx =  IAuthHeaderIdParamMismatchError | AuthorizedRequestError | INoUserFoundError;

    export interface Success extends OkResponse {
        updated: string[];
        'rejected-props': string[];
    }

    export type Tx = ErrTx | Success;
}
