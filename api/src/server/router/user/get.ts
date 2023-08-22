import { DatabaseActions, HandlerRoute, RoutePayload } from 'route-handling/route-infra';
import { FilterQuery, ObjectId } from 'mongodb';
import { DbUser } from 'database/user';
import { IObjectIdParse } from 'interface/error/object-id-parse';
import { Request } from 'express';
import { User } from 'interface/data-types';
import { parseObjectId } from 'tools/object-id';

export namespace IGetUser {
    export type ErrorTx = IObjectIdParse;

    export interface Success {
        'allowed-queries'?: string[];
        'blocked-queries'?: string[];
        ok: true;
        users: User[];
    }

    export type Tx = ErrorTx | Success;
}

const ACCEPTED_QUERIES = new Set(['id', 'ids', 'username', 'usernames']);

type ReturnType = Promise<RoutePayload<IGetUser.Tx>>;
export async function getUser(request: Request, actions: DatabaseActions): ReturnType {
    const allowed: string[] = [];
    const blocked: string[] = [];
    if (Object.keys(request.query).length > 0) {
        for (const query in request.query)
            if (ACCEPTED_QUERIES.has(query)) allowed.push(query);
            else blocked.push(query);
    }

    const databaseQuery: FilterQuery<DbUser> = {};
    allowed.forEach(query => {
        switch (query) {
            case 'id': {
                const parseId = parseObjectId('query.id', request.query.id as string);
                if (parseId.ok === false) return parseId.error;
                databaseQuery._id = parseId.id;
                break;
            }
            case 'ids': {
                const regex = /([a-f\d]{24})/g;
                const ids = Array.from((request.query.ids as string).matchAll(regex)).map(regexMatch => regexMatch[1]);
                if (ids.length === 0) break;
                const objectIds = ids.map(id => new ObjectId(id));
                databaseQuery._id = { $in: objectIds };
                break;
            }
            case 'username':
                databaseQuery.username = request.query.username as string;
                break;
            case 'usernames':
                databaseQuery.username = { $in: (request.query.usernames as string).split(',') };
                break;
        }
        return;
    });

    const users: User[] = (await actions.user.getManyByQuery(databaseQuery)).map(user => user.toInterface());
    return {
        code: 200,
        message: `Retreived ${users.length} users.`,
        payload: {
            ... allowed.length && { 'allowed-queries': allowed },
            ... blocked.length && { 'blocked-queries': blocked },
            ok: true,
            users
        }
    };
}

export const route: HandlerRoute = {
    handler: getUser, method: 'GET', path: '/user'
};
