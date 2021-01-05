import { Post } from '../interface/data-types';
import { ObjectId } from 'mongodb';
import { BoundUser } from 'app/database/dbi/user-api';
import { objectIdParseErrorMessage } from 'app/error-messages';
import { RouteInfo, RouteHandler, RoutePayload } from 'server/route-handling/route-infra';
import { CreatePost, GetPost, GetPosts, GetUser, RatePost } from '../interface-bindings/api-responses';
import { ICreatePost, IGetPost, IGetPosts, IGetUser, IRatePost } from 'interface/responses/api-responses';
import { getPostOrFail, createObjectIdOrFail, scopeMustHaveProps, getUserOrFail, authorizeOrFail } from '../route-handling/route-handler';

export const getUser: RouteHandler<IGetUser.Tx> = function getUser(request, actions): Promise<RoutePayload<IGetUser.Tx>> {
    return new Promise<RoutePayload<IGetUser.Tx>>(async resolve => {
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
        resolve(new GetUser.Success(user.toInterface()).toRoutePayload());
    });
};

export const getPosts: RouteHandler<IGetPosts.Tx> = function getPosts(request, actions): Promise<RoutePayload<IGetPosts.Tx>> {
    return new Promise<RoutePayload<IGetPosts.Tx>>(async resolve => {
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
        resolve(new GetPosts.Success(posts.map(post => post.toInterface()), allowed, blocked).toRoutePayload());
    });
};

export const getPost: RouteHandler<IGetPost.Tx> = function getPost(request, actions): Promise<RoutePayload<IGetPost.Tx>> {
    return new Promise<RoutePayload<IGetPost.Tx>>(async resolve => {
        const id = createObjectIdOrFail(resolve, request.params.id);
        const post = await getPostOrFail(resolve, actions.post, id);
        resolve(new GetPost.Success(post.toInterface()).toRoutePayload());
    });
};

export const createPost: RouteHandler<ICreatePost.Tx> = function createPost(request, actions): Promise<RoutePayload<ICreatePost.Tx>> {
    return new Promise<RoutePayload<ICreatePost.Tx>>(async resolve => {
        const user = await authorizeOrFail(resolve, actions.common, request.headers.authorization);
        scopeMustHaveProps(resolve, request.body, 'body', ['title', 'content']);
        const post = await actions.post.createPost(user._id, request.body.title, request.body.content);
        resolve(new CreatePost.Success(post.toInterface()).toRoutePayload());
    });
};

export const ratePost: RouteHandler<IRatePost.Tx> = function ratePost(request, actions): Promise<RoutePayload<IRatePost.Tx>> {
    return new Promise<RoutePayload<IRatePost.Tx>>(async resolve => {
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
        resolve(new RatePost.Success(post, rating).toRoutePayload());
    });
};

export const routes: RouteInfo[] = [
    { method: 'GET',  path: '/api/user/:id',      handler: getUser },
    { method: 'GET',  path: '/api/posts',         handler: getPosts },
    { method: 'POST', path: '/api/post',          handler: createPost },
    { method: 'GET',  path: '/api/post/:id',      handler: getPost },
    { method: 'POST', path: '/api/rate/post/:id', handler: ratePost }
];
