import { IErrorResponse } from '../response';

export interface IObjectIdParseError extends IErrorResponse<'Object Id Parse'> {
    provided: string;
}

export interface INoUserFoundError extends IErrorResponse<'No User Found'> {
    id: string;
}

export interface INoPostFoundError extends IErrorResponse<'No Post Found'> {
    id: string;
}

export interface INoCommentFoundError extends IErrorResponse<'No Comment Found'> {
    id: string;
}

export interface IMissingDataError extends IErrorResponse<'Missing Data'> {
    missing: {
        received: string[];
        'scope-name': string;
        required: string[];
    };
}

export interface IUnauthenticatedError extends IErrorResponse<'Unauthenticated'> { }

export interface IUnauthorizedError extends IErrorResponse<'Unauthorized'> { }

export interface IAuthorizationParseError extends IErrorResponse<'Authorization Parsing Error'> {
    part: 'Authorization Type' | 'Username' | 'Password';
}

export type AuthorizedRequestError = IAuthorizationParseError | IUnauthenticatedError | IUnauthorizedError;

export interface IAuthHeaderIdParamMismatchError extends IErrorResponse<'Authorization Header and Id Param Mismatch'> {
    headerId: string;
    paramId: string;
}

export interface IIllegalValueError extends IErrorResponse<'Illegal Value'> {
    providedValue: any;   // eslint-disable-line @typescript-eslint/no-explicit-any
    allowedValues: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    context: string;
}
