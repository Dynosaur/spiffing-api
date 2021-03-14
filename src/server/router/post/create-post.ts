import { Request }                           from 'express';
import { IMissingBody, MissingBody }         from 'interface/error/missing-body';
import { Post }                              from 'interface/data-types';
import { IUnauthenticated, Unauthenticated } from 'interface/error/unauthenticated';
import { IUnauthorized, Unauthorized }       from 'interface/error/unauthorized';
import { IAuthorizationParse }               from 'interface/error/authorization-parse';
import { DatabaseActions, RoutePayload }     from 'route-handling/route-infra';
import { decodeBasicAuth }                   from 'tools/auth';

export namespace ICreatePost {
    export type ErrorTx =
        | IAuthorizationParse
        | IMissingBody
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        ok: true;
        post: Post;
    }

    export type Tx = ErrorTx | Success;
}

type ReturnType = Promise<RoutePayload<ICreatePost.Tx>>;

export async function createPost(request: Request, actions: DatabaseActions): ReturnType {
    if (request.headers.authorization === undefined) return new Unauthenticated();
    if (request.body.content === undefined) return new MissingBody('content');
    if (request.body.title === undefined) return new MissingBody('title');

    const decode = decodeBasicAuth(request.headers.authorization);
    if (decode.ok === false) return decode.error;
    const user = await actions.common.authorize(decode.username, decode.password);
    if (!user) return new Unauthorized();

    const post = await actions.post.create(user._id, request.body.title, request.body.content);

    return {
        code: 201,
        message: 'Successfully created post.',
        payload: {
            ok: true,
            post: post.toInterface()
        }
    };
}
