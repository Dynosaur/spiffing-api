import { ErrorResponse } from '../response';

export interface MissingDataError extends ErrorResponse<'Missing Requirements'> {
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
export type AuthenticateErrorResponse = UnauthorizedErrorResponse | AuthParseErrorResponse | MissingDataError ;

export namespace AuthenticationError {
    export interface ParsingError extends ErrorResponse<'Authorization Header Parse'> {
        field: 'username' | 'password' | 'type' | 'username param';
    }
    export type Failed = ErrorResponse<'Authorization Failed'>;

    export type Tx = MissingDataError | ParsingError | Failed;
}
