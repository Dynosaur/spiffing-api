import { ContentNotFound, IContentNotFound } from 'interface/error/content-not-found';
import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { IIllegalValue, IllegalValue } from 'interface/error/illegal-value';
import { IMissing, Missing } from 'interface/error/missing';
import { IUnauthenticated, Unauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized, Unauthorized } from 'interface/error/unauthorized';
import { Comment } from 'interface/data-types';
import { CommentWrapper } from 'database/comment';
import { IAuthorizationParse } from 'interface/error/authorization-parse';
import { IObjectIdParse } from 'interface/error/object-id-parse';
import { Request } from 'express';
import { decodeBasicAuth } from 'tools/auth';
import { parseObjectId } from 'tools/object-id';

export namespace ICreateComment {
    export type ErrorTx =
        | IAuthorizationParse
        | IContentNotFound
        | IIllegalValue
        | IMissing
        | IObjectIdParse
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        comment: Comment;
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

class Success extends RoutePayload<ICreateComment.Success> {
    constructor(comment: CommentWrapper) {
        super(
            `Successfully created comment ${comment.id}.`,
            { comment: comment.toInterface(), ok: true },
            201
        );
    }
}

type ReturnType = Promise<RoutePayload<ICreateComment.Tx>>;

export async function createComment(request: Request, actions: DatabaseActions): ReturnType {
    if (request.headers.authorization === undefined) return new Unauthenticated();
    if (request.body.content === undefined) return new Missing('body', 'content');

    const decode = decodeBasicAuth(request.headers.authorization);
    if (decode.ok === false) return decode.error;
    const user = await actions.common.authorize(decode.username, decode.password);
    if (!user) return new Unauthorized();

    const parseId = parseObjectId('params.id', request.params.id);
    if (parseId.ok === false) return parseId.error;
    const id = parseId.id;

    if (request.params.contentType === 'post') {
        const post = await actions.post.get(id);
        if (post === null) return new ContentNotFound(id, 'Post');
        const comment = await actions.comment.create(user._id, request.body.content, 'post', post._id);
        return new Success(comment);
    } else if (request.params.contentType === 'comment') {
        const comment = await actions.comment.get(id);
        if (comment === null) return new ContentNotFound(id, 'Comment');
        const subcomment = await actions.comment.create(user._id, request.body.content, 'comment', comment._id);
        return new Success(subcomment);
    } else return new IllegalValue('params.contentType', request.params.contentType, ['post', 'comment']);
}

export const route: HandlerRoute = {
    handler: createComment, method: 'POST', path: '/comment'
};
