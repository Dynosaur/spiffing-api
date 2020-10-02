import { GetPosts, TxNoResults, TxCreated, DataResponse } from '../interface';
import { ExportedRoutes, HandlerReply, ResourceManager, } from '../server';
import { checkScope, reply, sendMissingParameter } from '../../tools';
import { Request as ExpressRequest } from 'express';

async function getUser(request: ExpressRequest, rsrc: ResourceManager): Promise<any> {
    const username = request.params.username;
    const user = await rsrc.user.getOne(username);
    if (user) {
        const message = `Successfully found user "${username}".`;
        return reply(200, message, 'OK', { data: {
            username: user.username,
            screenName: user.screenName,
            created: user.created
        }});
    } else {
        const message = `Could not find user "${username}"`;
        return reply(404, message, 'NO_RESULTS');
    }
}

async function getPosts(request: ExpressRequest, rsrc: ResourceManager): Promise<HandlerReply> {
    const posts = await rsrc.post.getPosts(request.query);
    if (posts.length) {
        return reply(200, `Found ${posts.length} posts.`, 'OK', { data: posts });
    }  else {
        return reply(404, `No results with query.`, 'NO_RESULTS');
    }
}

async function createPost(request: ExpressRequest, rsrc: ResourceManager): Promise<HandlerReply> {
    const check = checkScope(request.body, ['author', 'title', 'content']);
    if (!check.ok) {
        return sendMissingParameter(check.param, 'body');
    }

    await rsrc.post.create(request.body.title, request.body.content, request.body.author);
    return reply(201, `Created new post "${request.body.title}"`, 'CREATED');
};

export function apiRoutes(): ExportedRoutes {
    return [
        { method: 'GET',  path: '/api/user/:username', handler: getUser },
        { method: 'GET',  path: '/api/posts',          handler: getPosts },
        { method: 'POST', path: '/api/post',           handler: createPost }
    ];
}
