import { Post } from '../interface/data-types';
import { ObjectId } from 'mongodb';
import { convertDbPost } from 'database/data-types';
import { payload, RouteInfo, RouteHandler, RoutePayload } from 'server/route-handling/route-infra';
import { CreatePostCreatedResponse, CreatePostEndpoint, GetPostEndpoint, GetPostErrorResponse, GetPostFoundResponse, GetPosts, GetUser } from 'interface/responses/api-responses';

export const getUser: RouteHandler<GetUser.Tx> = async function getUser(request, actions): Promise<RoutePayload<GetUser.Tx>> {
    const username = request.params.username;
    const user = await actions.user.readUser({ username });
    if (user) return payload<GetUser.Ok.UserFound>(`Successfully found user "${username}".`, 200, true, { user: user.toInterface() });
    else return payload<GetUser.Failed.UserNotFound>(`Could not find user "${username}".`, 200, false, { error: 'User Not Found' });
};

export const getPosts: RouteHandler<GetPosts.Tx> = async function getPosts(request, actions): Promise<RoutePayload<GetPosts.Tx>> {
    const allowedKeys: Array<keyof Post> = ['author', 'date', 'title'];
    const allowed: string[] = [];
    const blocked: string[] = [];
    for (const queryKey of Object.keys(request.query)) {
        if (!allowedKeys.includes(queryKey as any)) {
            delete request.query[queryKey];
            blocked.push(queryKey);
        } else allowed.push(queryKey);
    }
    const posts = await actions.post.readPosts(request.query);
    return payload<GetPosts.PostsFound>(`Successfully found ${posts.length} posts.`, 200, true, {
        posts: posts.map(post => post.toInterface()),
        ...allowed.length && { 'query-allowed': allowed },
        ...blocked.length && { 'query-blocked': blocked }
    });
};

export const getPost: RouteHandler<GetPostEndpoint> = async function getPost(request, actions): Promise<RoutePayload<GetPostEndpoint>> {
    const post = await actions.post.readPosts({ _id: new ObjectId(request.params.id) });
    if (post.length) return payload<GetPostFoundResponse>(`Found post ${request.params.id}.`, 200, true, { post: convertDbPost(post[0]) });
    else return payload<GetPostErrorResponse>(`Could not find post ${request.params.id}.`, 200, false, { error: 'Post Not Found' });
};

export const createPost: RouteHandler<CreatePostEndpoint> = async function createPost(request, actions): Promise<RoutePayload<CreatePostEndpoint>> {
    const postAuthor = new ObjectId(request.body.author);
    const post = await actions.post.createPost(postAuthor, request.body.title, request.body.content);
    return payload<CreatePostCreatedResponse>('Successfully created post.', 201, true, { post: convertDbPost(post) });
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
