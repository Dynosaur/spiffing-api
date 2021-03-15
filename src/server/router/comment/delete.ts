import { Request } from 'express';
import { IAuthorizationParse }                         from 'interface/error/authorization-parse';
import { ContentNotFound, IContentNotFound }           from 'interface/error/content-not-found';
import { IUnauthenticated, Unauthenticated }           from 'interface/error/unauthenticated';
import { IUnauthorized, Unauthorized }                 from 'interface/error/unauthorized';
import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { decodeBasicAuth }                             from 'tools/auth';
import { parseObjectId }                               from 'tools/object-id';

export namespace IDeleteComment {
    export type ErrorTx =
        | IAuthorizationParse
        | IContentNotFound
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        fullyDeleted: boolean;
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

type ReturnType = Promise<RoutePayload<IDeleteComment.Tx>>;

export async function deleteComment(request: Request, actions: DatabaseActions): ReturnType {
    if (!request.headers.authorization) return new Unauthenticated();

    const decode = decodeBasicAuth(request.headers.authorization);
    if (!decode.ok) return decode.error;

    const user = await actions.common.authorize(decode.username, decode.password);
    if (!user) return new Unauthorized();

    const parseId = parseObjectId(request.params.id);
    if (parseId.ok === false) return parseId.error;
    const commentId = parseId.id;

    const comment = await actions.comment.get(commentId);
    if (comment === null) return new ContentNotFound(commentId, 'Comment');

    if (user.id !== comment.authorString) return new Unauthorized();

    const deleteResult = await actions.comment.delete(comment.id);
    return {
        code: 200,
        message: `Deleted post ${comment.id}.`,
        payload: {
            fullyDeleted: deleteResult,
            ok: true
        }
    };
}

export const route: HandlerRoute = {
    handler: deleteComment, method: 'DELETE', path: '/comment'
};
