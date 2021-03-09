import { Request }               from 'express';
import { FilterQuery, ObjectId } from 'mongodb';
import { DbComment }                     from 'database/comment';
import { UserWrapper }                   from 'database/user';
import { Comment }                       from 'interface/data-types';
import { IGetComments }                  from 'interface/responses/api-responses';
import { GetComments }                   from 'interface-bindings/api-responses';
import { MissingDataError }              from 'interface-bindings/error-responses';
import { DatabaseActions, RoutePayload } from 'route-handling/route-infra';
import { objectIdParseErrorMessage }     from '../../error-messages';

export async function getComments(
    request: Request,
    actions: DatabaseActions
): Promise<RoutePayload<IGetComments.Tx>> {
    const filter: FilterQuery<DbComment> = {};
    const accepted: string[] = [];
    let includeAuthorUser = false;
    if (request.query.hasOwnProperty('parentType') || request.query.hasOwnProperty('parentId')) {
        if (!request.query.hasOwnProperty('parentType'))
            return new MissingDataError('params', ['parentId'], ['parentType']);
        else if (!request.query.hasOwnProperty('parentId'))
            return new MissingDataError('params', ['parentType'], ['parentId']);
        if (request.query.parentType !== 'comment' && request.query.parentType !== 'post')
            return new GetComments.InvalidInputError(['comment', 'post'], 'params', 'parentType',
                request.query.parentType as string);
        else
            try {
                const parentObjectId = new ObjectId(request.query.parentId as string);
                filter.parent = {
                    _id: parentObjectId,
                    contentType: request.query.parentType
                };
                delete request.query.parentId;
                delete request.query.parentType;
                accepted.push('parentId');
                accepted.push('parentType');
            } catch (e) {
                if (e.message === objectIdParseErrorMessage)
                    return new GetComments.InvalidInputError('ObjectId', 'params', 'parentId',
                        request.query.parentId as string);
                else throw e;
            }
    }
    if (request.query.hasOwnProperty('author'))
        try {
            const authorObjectId = new ObjectId(request.query.author as string);
            filter.author = authorObjectId;
            delete request.query.author;
            accepted.push('author');
        } catch (e) {
            if (e.message === objectIdParseErrorMessage)
                return new GetComments.InvalidInputError('ObjectId', 'params', 'author',
                    request.query.author as string);
            else throw e;
        }
    if (request.query.hasOwnProperty('include')) {
        switch (request.query.include) {
            case 'authorUser':
                includeAuthorUser = true;
                delete request.query.include;
                accepted.push('include');
                break;
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
    return new GetComments.Success(interfaceComments, accepted, Object.keys(request.query), includeSuccess);
}
