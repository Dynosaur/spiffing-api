import { User } from '../data-types';
import { ErrorResponse, SuccessfulResponse } from '../response';
import { AuthenticateErrorResponse, AuthParseErrorResponse, MissingDataErrorResponse } from './error-responses';

export interface SuccessfulRegisterResponse extends SuccessfulResponse {
    status: 'Ok' | 'Ok Test';
}
export interface RegisterCreatedResponse extends SuccessfulRegisterResponse {
    status: 'Ok';
    user: User;
}
export interface RegisterTestResponse extends SuccessfulRegisterResponse {
    status: 'Ok Test';
}
export interface RegisterUserExistsErrorResponse extends ErrorResponse<'User Already Exists'> { }
export type RegisterEndpoint =
    AuthParseErrorResponse |
    MissingDataErrorResponse |
    RegisterTestResponse |
    RegisterCreatedResponse |
    RegisterUserExistsErrorResponse;

export type AuthenticateEndpoint =
    SuccessfulResponse |
    AuthenticateErrorResponse;

export interface DeregisterErrorResponse extends ErrorResponse<'User Removal' | 'Posts Removal'> { }
export type DeregisterEndpoint =
    AuthenticateErrorResponse |
    DeregisterErrorResponse |
    SuccessfulResponse;

export interface PatchUpdatedResponse extends SuccessfulResponse {
    updated: string[];
}
export type PatchEndpoint =
    AuthenticateErrorResponse |
    PatchUpdatedResponse;
