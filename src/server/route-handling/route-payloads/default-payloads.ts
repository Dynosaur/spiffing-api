import { Response2 } from '../../interface';
import { RoutePayload } from '../route-handler';

export function unauthorized(message: string): RoutePayload<Response2> {
    return { httpCode: 401, consoleMessage: 'Unauthorized.', payload: {
        status: 'UNAUTHORIZED', message
    }};
}
