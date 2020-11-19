import { Response } from '../response';

export interface MissingDataErrorResponse extends Response<'MISSING_DATA'> {
    missing: {
        possible: string[][];
        provided: string[];
        scope: string;
    };
}

export interface AuthParseErrorResponse extends Response<'E_AUTH_HEADER_PARSE'> {
    field: 'username' | 'password' | 'type';
    message: string;
}

export type UnauthorizedError = 'E_AUTH_FAILED' | 'E_AUTH_NO_USER';
export type UnauthorizedErrorResponse = Response<UnauthorizedError>;

export type UserExistsErrorResponse = Response<'E_USER_EXISTS'>;

export type UserNoExistErrorResponse = Response<'E_USER_NO_EXIST'>;

export type AuthenticateErrorResponse = AuthParseErrorResponse | MissingDataErrorResponse | UnauthorizedErrorResponse | UserNoExistErrorResponse;

export interface InternalServerErrorResponse extends Response<'E_INTERNAL'> {
    message: string;
}
