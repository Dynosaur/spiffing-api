import { Request }                                     from 'express';
import { IAuthorizationParse }                         from 'interface/error/authorization-parse';
import { IMissingParam, MissingParam }                 from 'interface/error/missing-param';
import { IObjectIdParse, ObjectIdParse }               from 'interface/error/object-id-parse';
import { IPostNotFound, PostNotFound }                 from 'interface/error/post-not-found';
import { IUnauthenticated, Unauthenticated }           from 'interface/error/unauthenticated';
import { IUnauthorized, Unauthorized }                 from 'interface/error/unauthorized';
import { IOk, Ok }                                     from 'interface/ok';
import { decodeBasicAuth }                             from 'tools/auth';
import { parseObjectId }                               from 'tools/object-id';
import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';

export namespace IDeletePost {
    type ErrorTx =
        | IAuthorizationParse
        | IMissingParam
        | IObjectIdParse
        | IPostNotFound
        | IUnauthenticated
        | IUnauthorized;

    export type Tx = ErrorTx | IOk;
}

type ReturnType = Promise<RoutePayload<IDeletePost.Tx>>;

export async function deletePost(request: Request, actions: DatabaseActions): ReturnType {
    if (request.headers.authorization === undefined) return new Unauthenticated();
    if (request.params.id === undefined) return new MissingParam('id');

    const decode = decodeBasicAuth(request.headers.authorization);
    if (decode.ok === false) return decode.error;
    const user = await actions.common.authorize(decode.username, decode.password);
    if (user === null) return new Unauthorized();

    const objectId = parseObjectId(request.params.id);
    if (objectId.ok === false) return new ObjectIdParse('params.id', request.params.id);
    const postId = objectId.id;

    const post = await actions.post.get(postId);
    if (post === null) return new PostNotFound(postId);
    if (user.id !== post.authorString) return new Unauthorized();

    await actions.post.delete(postId);

    return new Ok();
}

export const routeInfo: HandlerRoute = {
    handler: deletePost, method: 'DELETE', path: '/post/:id'
};
