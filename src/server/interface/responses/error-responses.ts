import { ErrorResponse } from '../response';

export interface MissingDataErrorResponse extends ErrorResponse<'Missing Requirements'> {
    missing: {
        possible: string[][];
        provided: string[];
        scope: string;
    };
}

export interface AuthParseErrorResponse extends ErrorResponse<'Authorization Header Parse'> {
    field: 'username' | 'password' | 'type' | 'username param';
}

export type UnauthorizedErrorResponse = ErrorResponse<'Authorization Failed'>;
export type AuthenticateErrorResponse =
    AuthParseErrorResponse |
    MissingDataErrorResponse |
    UnauthorizedErrorResponse;
