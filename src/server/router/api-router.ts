import { CreatePostEndpoint, GetPostEndpoint, GetPostsEndpoint,
GetUserEndpoint } from '../interface/responses/api-responses';
import { ExportedRoutes, RouteHandler } from '../route-handling/route-handler';
import { payload } from '../route-handling/response-functions';

const getUser: RouteHandler<GetUserEndpoint> = async (request, actions) => {
    const username = request.params.username;

    const op = await actions.readUser(username);
    switch (op.status) {
        case 'OK': {
            const user = op.data;
            delete user.password;
            return payload<GetUserEndpoint>(200, `Successfully found user "${username}".`, {
                status: 'OK', user
            });
        }
        case 'NO_USER': {
            return payload<GetUserEndpoint>(404, `Could not find user "${username}".`, {
                status: 'NOT_FOUND'
            });
        }
        default:
            throw new Error(`Unexpected check state:\n${JSON.stringify(op, null, 4)}`);
    }
};

const getPosts: RouteHandler<GetPostsEndpoint> = async (request, actions) => {
    const op = await actions.readPosts(request.query);

    return payload<GetPostsEndpoint>(200, `Successfully found ${op.length} posts.`, {
        status: 'OK', posts: op
    });
};

const getPost: RouteHandler<GetPostEndpoint> = async (request, actions) => {
    const op = await actions.readPosts({ id: request.params.id });
    if (op.length) {
        return payload<GetPostEndpoint>(200, `Found post ${request.params.id}.`, {
            status: 'OK', post: op[0]
        });
    } else {
        return payload<GetPostEndpoint>(404, `Could not find post ${request.params.id}.`, {
            status: 'NOT_FOUND'
        });
    }
};

const createPost: RouteHandler<CreatePostEndpoint> = async (request, actions, checks) => {
    const authCheck = await checks.authenticate(request);
    switch (authCheck.state) {
        case 'error':
            return authCheck.error;
        case 'ok':
            break;
        default:
            throw new Error(`Unexpected check state:\n${JSON.stringify(authCheck, null, 4)}`);
    }
    const bodyCheck = checks.checkScope(['author', 'content', 'title'], request.body, 'body');
    if (bodyCheck) {
        return bodyCheck;
    }

    await actions.createPost(request.body.title, request.body.content, request.body.author);
    return payload<CreatePostEndpoint>(201, `Successfully created post.`, {
        status: 'CREATED'
    });
};

export function apiRoutes(): ExportedRoutes {
    return [
        { method: 'GET',  path: '/api/user/:username',  handler: getUser },
        { method: 'GET',  path: '/api/posts',           handler: getPosts },
        { method: 'POST', path: '/api/:username/post',  handler: createPost },
        { method: 'GET',  path: '/api/post/:id',        handler: getPost }
    ];
}
