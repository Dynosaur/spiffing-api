import { Request }  from 'express';
import { ObjectId } from 'mongodb';
import { IRatePost }                     from 'interface/responses/api-responses';
import { RatePost }                      from 'interface-bindings/api-responses';
import { DatabaseActions, RoutePayload } from 'route-handling/route-infra';
import { decodeBasicAuth }               from 'tools/auth';
import { objectIdParseErrorMessage }     from '../../error-messages';
import {
    MissingDataError,
    NoPostFoundError,
    ObjectIdParseError,
    UnauthenticatedError,
    UnauthorizedError
} from 'interface-bindings/error-responses';

export async function ratePost(request: Request, actions: DatabaseActions): Promise<RoutePayload<IRatePost.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();
    if (!request.body.hasOwnProperty('rating'))
        return new MissingDataError('body', Object.keys(request.body), ['rating']);
    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;
    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();
    let postId: ObjectId;
    try {
        postId = new ObjectId(request.params.id);
    } catch (error) {
        if (error.message === objectIdParseErrorMessage)
            return new ObjectIdParseError(request.params.id);
        else throw error;
    }
    const rating = Math.sign(request.body.rating);
    const post = await actions.post.get(postId);
    if (!post) return new NoPostFoundError(postId.toHexString());
    let result = false;
    const rate = await actions.user.getUserRateApi(user._id);
    switch (rating) {
        case -1:
            result = await rate.dislikePost(post._id);
            break;
        case 0:
            result = await rate.unratePost(post._id);
            break;
        case 1:
            result = await rate.likePost(post._id);
            break;
    }
    return new RatePost.Success(post, rating, result);
}
