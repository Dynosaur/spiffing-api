import { Response } from '../response';
import { AuthenticateErrorResponse, AuthParseErrorResponse, InternalServerErrorResponse,
UserExistsErrorResponse } from './error-responses';

export type RegisterEndpoint =
    Response<'CREATED' | 'TEST_OK'> |
    UserExistsErrorResponse |
    AuthParseErrorResponse;

export type AuthenticateEndpoint =
    Response<'OK'> |
    AuthenticateErrorResponse;

export type DeregisterEndpoint =
    Response<'DELETED'> |
    AuthenticateErrorResponse |
    InternalServerErrorResponse;

export interface PatchUpdatedResponse extends Response<'UPDATED'> {
    updated: string[];
}
export type PatchEndpoint =
    PatchUpdatedResponse |
    AuthenticateErrorResponse |
    InternalServerErrorResponse;
