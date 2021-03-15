import { ContentNotFound, IContentNotFound } from 'interface/error/content-not-found';
import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { IMissing, Missing } from 'interface/error/missing';
import { IObjectIdParse, ObjectIdParse } from 'interface/error/object-id-parse';
import { IUnauthenticated, Unauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized, Unauthorized } from 'interface/error/unauthorized';
import { IAuthorizationParse } from 'interface/error/authorization-parse';
import { Request } from 'express';
import { decodeBasicAuth } from 'tools/auth';
import { parseObjectId } from 'tools/object-id';

export namespace IDeletePost {
    type ErrorTx =
        | IAuthorizationParse
        | IMissing
        | IObjectIdParse
        | IContentNotFound
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

type ReturnType = Promise<RoutePayload<IDeletePost.Tx>>;

export async function deletePost(request: Request, actions: DatabaseActions): ReturnType {
    if (request.headers.authorization === undefined) return new Unauthenticated();
    if (request.params.id === undefined) return new Missing('param', 'id');

    const decode = decodeBasicAuth(request.headers.authorization);
    if (decode.ok === false) return decode.error;
    const user = await actions.common.authorize(decode.username, decode.password);
    if (user === null) return new Unauthorized();

    const objectId = parseObjectId(request.params.id);
    if (objectId.ok === false) return new ObjectIdParse('params.id', request.params.id);
    const postId = objectId.id;

    const post = await actions.post.get(postId);
    if (post === null) return new ContentNotFound(postId, 'Post');
    if (user.id !== post.authorString) return new Unauthorized();

    await actions.post.delete(postId);

    return {
        code: 200,
        message: `Deleted post ${post.id}.`,
        payload: { ok: true }
    };
}

export const route: HandlerRoute = {
    handler: deletePost, method: 'DELETE', path: '/post/:id'
};
