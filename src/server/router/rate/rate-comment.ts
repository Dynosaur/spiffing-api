import { ContentNotFound, IContentNotFound } from 'interface/error/content-not-found';
import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { IMissing, Missing } from 'interface/error/missing';
import { IUnauthenticated, Unauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized, Unauthorized } from 'interface/error/unauthorized';
import { IAuthorizationParse } from 'interface/error/authorization-parse';
import { IObjectIdParse } from 'interface/error/object-id-parse';
import { Request } from 'express';
import { decodeBasicAuth } from 'tools/auth';
import { parseObjectId } from 'tools/object-id';

export namespace IRateComment {
    export type ErrorTx =
        | IAuthorizationParse
        | IContentNotFound
        | IMissing
        | IObjectIdParse
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        change: boolean;
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

export async function rateComment(request: Request, actions: DatabaseActions): Promise<RoutePayload<IRateComment.Tx>> {
    if (!request.headers.authorization) return new Unauthenticated();
    if (!request.body.hasOwnProperty('rating'))
        return new Missing('body', 'rating');

    const decode = decodeBasicAuth(request.headers.authorization);
    if (decode.ok === false) return decode.error;
    const user = await actions.common.authorize(decode.username, decode.password);
    if (!user) return new Unauthorized();

    const parseId = parseObjectId(request.params.id);
    if (parseId.ok === false) return parseId.error;
    const commentId = parseId.id;

    const rating = Math.sign(request.body.rating);
    const comment = await actions.comment.get(commentId);
    if (comment === null) return new ContentNotFound(request.params.id, 'Comment');

    let result = false;
    const rate = await actions.user.getUserRateApi(user._id);
    switch (rating) {
        case -1:
            result = await rate.dislikeComment(comment._id);
            break;
        case 0:
            result = await rate.unrateComment(comment._id);
            break;
        case 1:
            result = await rate.likeComment(comment._id);
            break;
    }
    return {
        code: 200,
        message: `Rated comment ${comment.id} with ${rating}.`,
        payload: {
            change: result,
            ok: true
        }
    };
}

export const route: HandlerRoute = {
    handler: rateComment, method: 'POST', path: '/rate/comment/:id'
};
