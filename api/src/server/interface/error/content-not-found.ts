import { ObjectId } from 'mongodb';
import { RoutePayload } from 'route-handling/route-infra';

export type Content = 'Comment' | 'Post' | 'User';

export interface IContentNotFound {
    content: Content;
    error: 'Content Not Found';
    id: string;
    ok: false;
}

export class ContentNotFound extends RoutePayload<IContentNotFound> {
    constructor(id: ObjectId | string, content: Content) {
        const stringId = typeof id === 'string' ? id : id.toHexString();
        super(`Could not find ${content.toLowerCase()} ${stringId}`,
            { content, error: 'Content Not Found', id: stringId, ok: false }, 404);
    }
}
