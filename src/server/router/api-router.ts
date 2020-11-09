import { CreatePostEndpoint, GetPostEndpoint, GetPostsEndpoint,
GetUserEndpoint } from '../interface/responses/api-responses';
import { RouteInfo, RouteHandler } from '../route-handling/route-infra';
import { payload } from '../route-handling/response-functions';

export const getUser: RouteHandler<GetUserEndpoint> = async (request, actions) => {
    const username = request.params.username;

    const op = await actions.readUser(username);
    if (op.status === 'NO_USER') {
        return payload<GetUserEndpoint>(404, `Could not find user "${username}".`, {
            status: 'NOT_FOUND'
        });
    } else {
        const user = op.data;
        delete user.password;
        return payload<GetUserEndpoint>(200, `Successfully found user "${username}".`, {
            status: 'OK', user
        });
    }
};

export const getPosts: RouteHandler<GetPostsEndpoint> = async (request, actions) => {
    const op = await actions.readPosts(request.query);

    return payload<GetPostsEndpoint>(200, `Successfully found ${op.length} posts.`, {
        status: 'OK', posts: op
    });
};

export const getPost: RouteHandler<GetPostEndpoint> = async (request, actions) => {
    const op = await actions.readPosts({ _id: request.params.id });
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

export const createPost: RouteHandler<CreatePostEndpoint> = async (request, actions) => {
    await actions.createPost(request.body.title, request.body.content, request.body.author);
    return payload<CreatePostEndpoint>(201, 'Successfully created post.', {
        status: 'CREATED'
    });
};

export const routes: RouteInfo[] = [
    { method: 'GET', path: '/api/user/:username', handler: getUser },
    { method: 'GET',  path: '/api/posts', handler: getPosts },
    { method: 'POST', path: '/api/:username/post', handler: createPost, requirements: {
        auth: {
            checkParamUsername: true,
            method: 'authenticate'
        },
        scope: {
            body: { required: ['author', 'content', 'title'], replacements: [] }
        }
    } },
    { method: 'GET',  path: '/api/post/:id', handler: getPost }
];
