import { ErrorResponse } from '../response';

export interface IObjectIdParseError extends ErrorResponse<'Object Id Parse'> {
    provided: string;
}

export interface INoUserFoundError extends ErrorResponse<'No User Found'> {
    id: string;
}

export interface INoPostFoundError extends ErrorResponse<'No Post Found'> {
    id: string;
}

export interface IMissingDataError extends ErrorResponse<'Missing Data'> {
    missing: {
        received: string[];
        'scope-name': string;
        required: string[];
    };
}

export interface IUnauthenticatedError extends ErrorResponse<'Unauthenticated'> { }

export interface IUnauthorizedError extends ErrorResponse<'Unauthorized'> { }

export interface IAuthorizationParseError extends ErrorResponse<'Authorization Parsing Error'> {
    part: 'Authorization Type' | 'Username' | 'Password';
}

export type AuthorizedRequestError = IAuthorizationParseError | IUnauthenticatedError | IUnauthorizedError;

export interface IAuthHeaderIdParamMismatchError extends ErrorResponse<'Authorization Header and Id Param Mismatch'> {
    headerId: string;
    paramId: string;
}
