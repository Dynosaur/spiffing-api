import { convertDbPost, convertDbUser } from 'database/database-actions';
import { payload, RouteInfo, RouteHandler, RoutePayload }
from 'server/route-handling/route-infra';
import { CreatePostCreatedResponse, CreatePostEndpoint, GetPostEndpoint,
GetPostErrorResponse, GetPostFoundResponse, GetPostsEndpoint, GetUserEndpoint,
GetUserErrorResponse, GetUserFoundResponse } from 'interface/responses/api-responses';

export const getUser: RouteHandler<GetUserEndpoint> =
async function getUser(request, actions): Promise<RoutePayload<GetUserEndpoint>> {
    const username = request.params.username;
    const user = await actions.readUser(username);
    if (user) {
        return payload<GetUserFoundResponse>(
            `Successfully found user "${username}".`,
            200,
            true,
            { user: convertDbUser(user) }
        );
    } else {
        return payload<GetUserErrorResponse>(
            `Could not find user "${username}".`,
            404,
            false,
            { error: 'User Not Found' }
        );
    }
};

export const getPosts: RouteHandler<GetPostsEndpoint> =
async function getPosts(request, actions): Promise<RoutePayload<GetPostsEndpoint>> {
    const posts = await actions.readPosts(request.query);
    return payload<GetPostsEndpoint>(
        `Successfully found ${posts.length} posts.`,
        200,
        true,
        { posts }
    );
};

export const getPost: RouteHandler<GetPostEndpoint> =
async function getPost(request, actions): Promise<RoutePayload<GetPostEndpoint>> {
    const post = await actions.readPosts({ _id: request.params.id });
    if (post.length) {
        return payload<GetPostFoundResponse>(
            `Found post ${request.params.id}.`,
            200,
            true,
            { post: post[0] }
        );
    } else {
        return payload<GetPostErrorResponse>(
            `Could not find post ${request.params.id}.`,
            404,
            false,
            { error: 'Post Not Found' }
        );
    }
};

export const createPost: RouteHandler<CreatePostEndpoint> =
async function createPost(request, actions): Promise<RoutePayload<CreatePostEndpoint>> {
    const post = await actions.createPost(
        request.body.title,
        request.body.content,
        request.body.author
    );
    return payload<CreatePostCreatedResponse>(
        'Successfully created post.',
        201,
        true,
        { post: convertDbPost(post) }
    );
};

export const routes: RouteInfo[] = [
    { method: 'GET', path: '/api/user/:username', handler: getUser },
    { method: 'GET',  path: '/api/posts', handler: getPosts },
    {
        method: 'POST', path: '/api/:username/post', handler: createPost,
        requirements: {
            auth: {
                checkParamUsername: true,
                method: 'authenticate'
            },
            scope: {
                body: { required: ['author', 'content', 'title'], replacements: [] }
            }
        }
    },
    { method: 'GET',  path: '/api/post/:id', handler: getPost }
];
