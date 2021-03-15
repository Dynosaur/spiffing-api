import { Request } from 'express';
import { IRateComment }                  from 'interface/responses/api-responses';
import { RateComment }                   from 'interface-bindings/api-responses';
import { DatabaseActions, RoutePayload } from 'route-handling/route-infra';
import { decodeBasicAuth }               from 'tools/auth';
import { parseObjectId }                 from 'tools/object-id';
import {
    MissingDataError,
    NoCommentFoundError,
    UnauthenticatedError,
    UnauthorizedError
} from 'interface-bindings/error-responses';

export async function rateComment(request: Request, actions: DatabaseActions): Promise<RoutePayload<IRateComment.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();
    if (!request.body.hasOwnProperty('rating'))
        return new MissingDataError('body', Object.keys(request.body), ['rating']);

    const decodeAuth = decodeBasicAuth(request.headers.authorization);
    if (decodeAuth instanceof RoutePayload) return decodeAuth;
    const user = await actions.common.authorize(decodeAuth.username, decodeAuth.password);
    if (!user) return new UnauthorizedError();

    const parseId = parseObjectId(request.params.id);
    if (parseId.ok === false) return parseId.error;
    const commentId = parseId.id;

    const rating = Math.sign(request.body.rating);
    const comment = await actions.comment.get(commentId);
    if (comment === null) return new NoCommentFoundError(request.params.id);

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
    return new RateComment.Success(comment, rating, result);
}
