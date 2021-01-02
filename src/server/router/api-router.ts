import { Post } from '../interface/data-types';
import { ObjectId } from 'mongodb';
import { BoundUser } from 'app/database/dbi/user-api';
import { payload, RouteInfo, RouteHandler, RoutePayload } from 'server/route-handling/route-infra';
import { CreatePost, GetPost, GetPosts, GetUser, RatePost } from 'interface/responses/api-responses';

export const getUser: RouteHandler<GetUser.Tx> = async function getUser(request, actions): Promise<RoutePayload<GetUser.Tx>> {
    const unparsedId: string = request.params.id;
    let parsedId: string | ObjectId;
    if (unparsedId.length === 24) {
        try {
            const uid = new ObjectId(unparsedId);
            parsedId = uid;
        } catch (e) {
            parsedId = unparsedId;
        }
    } else parsedId = unparsedId;

    let user: BoundUser;
    if (typeof parsedId === 'string')
        user = await actions.user.readUser({ username: parsedId });
    else
        user = await actions.user.readUser({ _id: parsedId });

    if (user)
        return payload<GetUser.Ok.UserFound>(`Successfully found user "${unparsedId}".`, 200, true, { user: user.toInterface() });
    else {
        const message = typeof parsedId === 'string' ? `Could not find user "${unparsedId}".` : `No user with the id of "${unparsedId}".`;
        return payload<GetUser.Failed.UserNotFound>(message, 200, false, { error: 'User Not Found' });
    }
};

export const getPosts: RouteHandler<GetPosts.Tx> = async function getPosts(request, actions): Promise<RoutePayload<GetPosts.Tx>> {
    const allowedKeys: Array<keyof Post> = ['author', 'date', 'title'];
    const allowed: string[] = [];
    const blocked: string[] = [];
    for (const queryKey of Object.keys(request.query)) {
        if (!allowedKeys.includes(queryKey as any)) {
            delete request.query[queryKey];
            blocked.push(queryKey);
        } else {
            allowed.push(queryKey);
            if (queryKey === 'author') {
                try {
                    request.query.author = new ObjectId(request.query.author as string) as any;
                } catch (error) {
                    if (error.message === 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
                        return payload<GetPosts.Failed.AuthorParse>('Could not parse ID param', 200, false, {
                            error: 'Author Parse',
                            provided: request.query.author as string
                        });
                }
            }
        }
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

export const ratePost: RouteHandler<RatePost.Tx> = async function ratePost(request, actions): Promise<RoutePayload<RatePost.Tx>> {
    const rating = Math.sign(request.body.rating);
    const post = await actions.post.readPost(request.params.id);
    if (post) {
        if (rating === 1) await post.like();
        else if (rating === -1) await post.dislike();
        return payload<RatePost.Ok>(`Rated post ${request.params.id} with ${rating}`, 200, true, {});
    } else {
        return payload<RatePost.Failed.NoPost>(`Could not find post ${request.params.id}`, 200, false, { error: 'No Post' });
    }
};

export const routes: RouteInfo[] = [
    { method: 'GET', path: '/api/user/:id', handler: getUser },
    { method: 'GET',  path: '/api/posts', handler: getPosts },
    {
        method: 'POST', path: '/api/post', handler: createPost,
        requirements: {
            auth: { method: 'authenticate' },
            scope: {
                body: { required: ['author', 'content', 'title'], replacements: [] }
            }
        }
    },
    { method: 'GET',  path: '/api/post/:id', handler: getPost },
    {
        handler: ratePost,
        method: 'POST',
        path: '/api/rate/post/:id',
        requirements: {
            auth: {
                checkParamUsername: false,
                method: 'authenticate'
            },
            scope: {
                body: { required: ['rating'], replacements: [] }
            }
        }
    }
];
