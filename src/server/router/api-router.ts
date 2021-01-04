import { Post } from '../interface/data-types';
import { ObjectId } from 'mongodb';
import { BoundUser } from 'app/database/dbi/user-api';
import { objectIdParseErrorMessage } from 'app/error-messages';
import { payload, RouteInfo, RouteHandler, RoutePayload } from 'server/route-handling/route-infra';
import { CreatePost, GetPost, GetPosts, GetUser, RatePost } from 'interface/responses/api-responses';
import { getPostOrFail, createObjectIdOrFail, scopeMustHaveProps, getUserOrFail, authorizeOrFail } from '../route-handling/route-handler';

export const getUser: RouteHandler<GetUser.Tx> = function getUser(request, actions): Promise<RoutePayload<GetUser.Tx>> {
    return new Promise<RoutePayload<GetUser.Tx>>(async resolve => {
        let id: ObjectId | string;
        let user: BoundUser;
        try {
            id = new ObjectId(request.params.id);
        } catch (error) {
            if (error.message === objectIdParseErrorMessage)
                id = request.params.id;
            else throw error;
        }
        user = await getUserOrFail(resolve, actions.user, id);
        resolve(payload<GetUser.Success>(`Successfully found user "${request.params.id}".`, 200, true, { user: user.toInterface() }));
    });
};

export const getPosts: RouteHandler<GetPosts.Tx> = function getPosts(request, actions): Promise<RoutePayload<GetPosts.Tx>> {
    return new Promise<RoutePayload<GetPosts.Tx>>(async resolve => {
        const allowedKeys: Array<keyof Post> = ['author', 'date', 'title'];
        const allowed: string[] = [];
        const blocked: string[] = [];
        for (const queryKey of Object.keys(request.query)) {
            if (!allowedKeys.includes(queryKey as any)) {
                delete request.query[queryKey];
                blocked.push(queryKey);
            } else {
                allowed.push(queryKey);
                if (queryKey === 'author')
                    request.query.author = createObjectIdOrFail(resolve, request.query.author as string) as any;
            }
        }
        const posts = await actions.post.readPosts(request.query);
        return payload<GetPosts.Success>(`Successfully found ${posts.length} posts.`, 200, true, {
            posts: posts.map(post => post.toInterface()),
            ...allowed.length && { 'query-allowed': allowed },
            ...blocked.length && { 'query-blocked': blocked }
        });
    });
};

export const getPost: RouteHandler<GetPost.Tx> = function getPost(request, actions): Promise<RoutePayload<GetPost.Tx>> {
    return new Promise<RoutePayload<GetPost.Tx>>(async resolve => {
        const id = createObjectIdOrFail(resolve, request.params.id);
        const post = await getPostOrFail(resolve, actions.post, id);
        resolve(payload<GetPost.Success>(`Found post ${request.params.id}.`, 200, true, { post: post[0].toInterface() }));
    });
};

export const createPost: RouteHandler<CreatePost.Tx> = function createPost(request, actions): Promise<RoutePayload<CreatePost.Tx>> {
    return new Promise<RoutePayload<CreatePost.Tx>>(async resolve => {
        const user = await authorizeOrFail(resolve, actions.common, request.headers.authorization);
        scopeMustHaveProps(resolve, request.body, 'body', ['title', 'content']);
        const post = await actions.post.createPost(user._id, request.body.title, request.body.content);
        resolve(payload<CreatePost.Success>('Successfully created post.', 201, true, { post: post.toInterface() }));
    });
};

export const ratePost: RouteHandler<RatePost.Tx> = function ratePost(request, actions): Promise<RoutePayload<RatePost.Tx>> {
    return new Promise<RoutePayload<RatePost.Tx>>(async resolve => {
        scopeMustHaveProps(resolve, request.body, 'body', ['rating']);
        const user = await authorizeOrFail(resolve, actions.common, request.headers.authorization);
        const postId = createObjectIdOrFail(resolve, request.params.id);
        const rating = Math.sign(request.body.rating);
        const post = await getPostOrFail(resolve, actions.post, postId);
        switch (rating) {
            case -1:
                await user.rate.dislikePost(post);
                break;
            case 0:
                await user.rate.unratePost(post);
                break;
            case 1:
                await user.rate.likePost(post);
                break;
        }
        resolve(payload<RatePost.Success>(`Rated post ${request.params.id} with ${rating}`, 200, true, { }));
    });
};

export const routes: RouteInfo[] = [
    { method: 'GET',  path: '/api/user/:id',      handler: getUser },
    { method: 'GET',  path: '/api/posts',         handler: getPosts },
    { method: 'POST', path: '/api/post',          handler: createPost },
    { method: 'GET',  path: '/api/post/:id',      handler: getPost },
    { method: 'POST', path: '/api/rate/post/:id', handler: ratePost }
];
