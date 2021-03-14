import { Request } from 'express';
import { IDeleteUser }                             from 'interface/responses/auth-endpoints';
import { DeleteUser }                              from 'interface-bindings/auth-responses';
import { UnauthenticatedError, UnauthorizedError } from 'interface-bindings/error-responses';
import { DatabaseActions, RoutePayload }           from 'route-handling/route-infra';
import { decodeBasicAuth }                         from 'tools/auth';


export async function deleteUser(request: Request, actions: DatabaseActions): Promise<RoutePayload<IDeleteUser.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();

    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;
    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();

    await actions.user.delete(user._id);
    return new DeleteUser.Success(user);
}
