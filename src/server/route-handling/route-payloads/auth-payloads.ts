import { RoutePayload } from '../route-handler';
import { RegisterEndpoint, RegisterResponseType } from '../../interface/responses/auth-endpoints';
import { unauthorized } from './default-payloads';

export class RegisterPayload implements RoutePayload<RegisterEndpoint> {
    constructor(status: RegisterResponseType, message: string) {
        switch (status) {
            case 'AUTHENTICATION_FAILED':
                return unauthorized(message);
            case 'AUTH_DECODING_ERROR':
                return null;
            case ''
        }
    }
}