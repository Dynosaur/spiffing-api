import { Post } from '../interface/data-types';
import { ObjectId } from 'mongodb';
import { CreatePost, GetPost, GetPosts, GetUser } from 'interface/responses/api-responses';
import { payload, RouteInfo, RouteHandler, RoutePayload } from 'server/route-handling/route-infra';

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

export const getPost: RouteHandler<GetPost.Tx> = async function getPost(request, actions): Promise<RoutePayload<GetPost.Tx>> {
    let _id: ObjectId;
    try {
        _id = new ObjectId(request.params.id);
    } catch (error) {
        if (error.message === 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
            return payload<GetPost.Failed.IDParse>('Could not parse ID param', 200, false, { error: 'Could Not Parse ID' });
        else throw error;
    }
    const post = await actions.post.readPosts({ _id });
    if (post.length) return payload<GetPost.Ok.FoundPost>(`Found post ${request.params.id}.`, 200, true, { post: post[0].toInterface() });
    else return payload<GetPost.Failed.NoPost>(`Could not find post ${request.params.id}.`, 200, false, { error: 'Post Not Found' });
};

export const createPost: RouteHandler<CreatePost.Tx> = async function createPost(request, actions): Promise<RoutePayload<CreatePost.Tx>> {
    let postAuthor: ObjectId;
    try {
        postAuthor = new ObjectId(request.body.author);
    } catch (e) {
        return payload<CreatePost.Failed.Parse>(`Could not parse request author id "${request.body.author}" into ObjectId`, 400, false, {
            error: 'Parsing Error',
            path: { body: { author: request.body.author } }
        });
    }
    const post = await actions.post.createPost(postAuthor, request.body.title, request.body.content);
    return payload<CreatePost.Ok.Created>('Successfully created post.', 201, true, { post: post.toInterface() });
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
