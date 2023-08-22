import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { FilterQuery, ObjectId } from 'mongodb';
import { Post, User } from 'interface/data-types';
import { DbPost } from 'database/post';
import { IObjectIdParse } from 'interface/error/object-id-parse';
import { Request } from 'express';
import { parseObjectId } from 'tools/object-id';

export namespace IGetPost {
    export type ErrorTx = IObjectIdParse;

    export interface Success {
        failed?: Record<string, any>;
        ok: true;
        posts: Post[];
        'query-allowed'?: string[];
        'query-blocked'?: string[];
    }

    export type Tx = ErrorTx | Success;
}

type ReturnType = Promise<RoutePayload<IGetPost.Tx>>;

const ALLOWED_QUERY_KEYS = new Set<string>(['author', 'id', 'ids', 'include', 'title']);
const ALLOWED_INCLUDE_VALUES = new Set<string>(['authorUser']);

export async function getPosts(request: Request, actions: DatabaseActions): ReturnType {
    let posts: Post[] = [];
    const failed: Record<string, any> = {};
    const allowed: string[] = [];
    const blocked: string[] = [];

    if (Object.keys(request.query).length === 0) {
        const boundPosts = await actions.post.getManyByQuery({});
        posts = boundPosts.map(post => post.toInterface());
    } else {
        const dbQuery: FilterQuery<DbPost> = {};
        for (const queryKey in request.query) {
            if (ALLOWED_QUERY_KEYS.has(queryKey)) {
                allowed.push(queryKey);
                const queryValue = request.query[queryKey] as string;
                switch (queryKey) {
                    case 'author': {
                        const parseId = parseObjectId('query.author', queryValue);
                        if (parseId.ok === false) return parseId.error;
                        dbQuery.author = parseId.id;
                        break;
                    }
                    case 'id': {
                        const parseId = parseObjectId('query.id', queryValue);
                        if (parseId.ok === false) return parseId.error;
                        dbQuery._id = parseId.id;
                        break;
                    }
                    case 'ids': {
                        const ids = queryValue.match(/[a-f\d]{24}/g);
                        if (ids === null) {
                            failed.ids = { error: 'No ObjectIds could be found', value: queryValue };
                            break;
                        }
                        const objectIds: ObjectId[] = [];
                        for (const match of ids) objectIds.push(new ObjectId(match));
                        dbQuery._id = { $in: objectIds };
                        break;
                    }
                    case 'include':
                        if (!ALLOWED_INCLUDE_VALUES.has(queryValue))
                            failed.include = {
                                allowed: Array.from(ALLOWED_INCLUDE_VALUES.keys()),
                                provided: queryValue
                            };
                        break;
                    case 'title':
                        dbQuery.title = queryValue;
                        break;
                    default:
                        throw new Error(`Query key "${queryKey}" is allowed but has no switch case!`);
                }
            } else blocked.push(queryKey);
        }
        const boundPosts = await actions.post.getManyByQuery(dbQuery);
        posts = boundPosts.map(post => post.toInterface());
    }

    if (request.query.include === 'authorUser') {
        const authorMap = new Map<string, User>();
        for (const post of posts) authorMap.set(post.author as string, null!);
        const authors = await actions.user.getManyById(Array.from(authorMap.keys()).map(id => new ObjectId(id)));
        authors.forEach(author => authorMap.set(author.id, author.toInterface()));
        posts.forEach(post => {
            post.author = post.author as string;
            if (authorMap.has(post.author)) post.author = authorMap.get(post.author)!;
            else throw new Error(`authorMap did not contain author ${post.author}`);
        });
    }

    return {
        code: 200,
        message: `Retreived ${posts.length} posts.`,
        payload: {
            ok: true,
            posts: posts,
            ... allowed.length && { 'query-allowed': allowed },
            ... blocked.length && { 'query-blocked': blocked },
            ... Object.keys(failed).length && { failed }
        }
    };
}

export const route: HandlerRoute = {
    handler: getPosts, method: 'GET', path: '/post'
};
