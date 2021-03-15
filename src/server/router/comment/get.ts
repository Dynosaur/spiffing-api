import { Request }     from 'express';
import { FilterQuery } from 'mongodb';
import { DbComment }                                   from 'database/comment';
import { UserWrapper }                                 from 'database/user';
import { Comment }                                     from 'interface/data-types';
import { IIllegalValue, IllegalValue }                 from 'interface/error/illegal-value';
import { IMissing, Missing }                           from 'interface/error/missing';
import { IObjectIdParse }                              from 'interface/error/object-id-parse';
import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { parseObjectId }                               from 'tools/object-id';

export namespace IGetComment {
    export type ErrorTx =
        | IIllegalValue
        | IMissing
        | IObjectIdParse;

    export interface Success {
        acceptedParams?: string[];
        comments: Comment[];
        ignoredParams?: string[];
        includeSuccessful?: boolean;
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

type ReturnType = Promise<RoutePayload<IGetComment.Tx>>;

export async function getComment(request: Request, actions: DatabaseActions): ReturnType {
    const filter: FilterQuery<DbComment> = {};
    const accepted: string[] = [];
    let includeAuthorUser = false;

    if (request.query.hasOwnProperty('parentType') || request.query.hasOwnProperty('parentId')) {
        if (!request.query.hasOwnProperty('parentType'))
            return new Missing('query', 'parentType', ['comment', 'post']);
        if (!request.query.hasOwnProperty('parentId'))
            return new Missing('query', 'parentId');
        if (request.query.parentType !== 'comment' && request.query.parentType !== 'post')
            return new IllegalValue('query.parentType', request.query.parentType, ['comment', 'post']);

        const parseId = parseObjectId(request.query.parentId as string);
        if (parseId.ok === false) return parseId.error;
        filter.parent = {
            _id: parseId.id,
            contentType: request.query.parentType
        };
        delete request.query.parentId;
        delete request.query.parentType;
        accepted.push('parentId');
        accepted.push('parentType');
    }

    if (request.query.hasOwnProperty('author')) {
        const parseId = parseObjectId(request.query.author as string);
        if (parseId.ok === false) return parseId.error;
        filter.author = parseId.id;
        delete request.query.author;
        accepted.push('author');
    }

    if (request.query.hasOwnProperty('include')) {
        switch (request.query.include) {
            case 'authorUser':
                includeAuthorUser = true;
                delete request.query.include;
                accepted.push('include');
                break;
            default:
                return new IllegalValue('query.include', request.query.include, ['authorUser']);
        }
    }

    const comments = await actions.comment.getManyByFilter(filter);
    let interfaceComments: Comment[] = [];
    let includeSuccess: boolean = undefined!;
    if (includeAuthorUser) {
        const authorIds = comments.map(comment => comment.author);
        const users = await actions.user.getManyById(authorIds);
        const userMap = new Map<string, UserWrapper>();
        users.forEach(user => userMap.set(user.id, user));
        includeSuccess = true;
        for (let i = 0; i < comments.length; i++)
            if (userMap.has(comments[i].authorString))
                interfaceComments[i] = comments[i].toInterface(userMap.get(comments[i].authorString)!.toInterface());
            else {
                includeSuccess = false;
                break;
            }
    } else interfaceComments = comments.map(comment => comment.toInterface());
    return {
        code: 200,
        message: `Retreived ${interfaceComments.length} comments.`,
        payload: {
            ok: true,
            comments: interfaceComments
        }
    };
}

export const route: HandlerRoute = {
    handler: getComment, method: 'GET', path: '/comment'
};
