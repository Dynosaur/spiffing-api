import { Post } from 'interface/data-types';
import { ObjectId } from 'mongodb';
import { BoundUser } from 'database/dbi/user-api';
import { decodeBasicAuth } from 'tools/auth';
import { scopeMustHaveProps } from 'route-handling/route-handler';
import { convertDbRatedPosts } from 'database/data-types';
import { objectIdParseErrorMessage } from 'app/error-messages';
import { RouteInfo, RouteHandler, RoutePayload } from 'server/route-handling/route-infra';
import { CreatePost, GetPost, GetPosts, GetRatedPosts, GetUser, RatePost } from 'interface-bindings/api-responses';
import { ICreatePost, IGetPost, IGetPosts, IGetRatedPosts, IGetUser, IRatePost } from 'interface/responses/api-responses';
import { AuthHeaderIdParamError, MissingDataError, NoPostFoundError, NoUserFoundError, ObjectIdParseError, UnauthenticatedError, UnauthorizedError } from 'interface-bindings/error-responses';

export const getUser: RouteHandler<IGetUser.Tx> = async function getUser(request, actions): Promise<RoutePayload<IGetUser.Tx>> {
    let id: ObjectId | string;
    try {
        id = new ObjectId(request.params.id);
    } catch (error) {
        if (error.message === objectIdParseErrorMessage)
            id = request.params.id;
        else throw error;
    }
    let user: BoundUser;
    if (id instanceof ObjectId) user = await actions.user.readUser({ _id: id });
    else user = await actions.user.readUser({ username: id });
    if (!user) return new NoUserFoundError(id instanceof ObjectId ? id.toHexString() : id);

    return new GetUser.Success(user.toInterface());
};

export const getPosts: RouteHandler<IGetPosts.Tx> = async function getPosts(request, actions): Promise<RoutePayload<IGetPosts.Tx>> {
    const allowedKeys: Array<keyof Post> = ['author', 'date', 'title'];
    const allowed: string[] = [];
    const blocked: string[] = [];
    for (const queryKey of Object.keys(request.query))
        if (!allowedKeys.includes(queryKey as any)) {
            delete request.query[queryKey];
            blocked.push(queryKey);
        } else {
            allowed.push(queryKey);
            if (queryKey === 'author') {
                try {
                    request.query.author = new ObjectId(request.query.author as string) as any;
                } catch (error) {
                    if (error.message === objectIdParseErrorMessage)
                        return new ObjectIdParseError(request.query.author as string);
                    else throw error;
                }
            }
        }
    const posts = await actions.post.readPosts(request.query);
    return new GetPosts.Success(posts.map(post => post.toInterface()), allowed, blocked);
};

export const getPost: RouteHandler<IGetPost.Tx> = async function getPost(request, actions): Promise<RoutePayload<IGetPost.Tx>> {
    let id: ObjectId;
    try {
        id = new ObjectId(request.params.id);
    } catch (error) {
        if (error.message === objectIdParseErrorMessage)
            return new ObjectIdParseError(request.params.id);
        else throw error;
    }
    const post = await actions.post.readPost(id);
    if (!post) return new NoPostFoundError(id.toHexString());
    return new GetPost.Success(post.toInterface());
};

export const createPost: RouteHandler<ICreatePost.Tx> = async function createPost(request, actions): Promise<RoutePayload<ICreatePost.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();
    const bodyError = scopeMustHaveProps(request.body, 'body', ['content', 'title']);
    if (bodyError) return bodyError;

    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;

    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();
    const post = await actions.post.createPost(user._id, request.body.title, request.body.content);
    return new CreatePost.Success(post.toInterface());
};

export const ratePost: RouteHandler<IRatePost.Tx> = async function ratePost(request, actions): Promise<RoutePayload<IRatePost.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();
    if (request.body.rating === undefined || request.body.rating === null)
        return new MissingDataError('body', Object.keys(request.body), ['rating']);
    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;
    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();
    let postId: ObjectId;
    try {
        postId = new ObjectId(request.params.id);
    } catch (error) {
        if (error.message === objectIdParseErrorMessage) return new ObjectIdParseError(request.params.id);
        else throw error;
    }
    const rating = Math.sign(request.body.rating);
    const post = await actions.post.readPost(postId);
    if (!post) return new NoPostFoundError(postId.toHexString());
    let result: boolean;
    switch (rating) {
        case -1:
            result = await user.rate.dislikePost(post);
            break;
        case 0:
            result = await user.rate.unratePost(post);
            break;
        case 1:
            result = await user.rate.likePost(post);
            break;
    }
    return new RatePost.Success(post, rating, result);
};

export const getRatedPosts: RouteHandler<IGetRatedPosts.Tx> = async function getRatedPosts(request, actions): Promise<RoutePayload<IGetRatedPosts.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();
    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;
    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();
    if (user.id !== request.params.ownerId) return new AuthHeaderIdParamError(user.id, request.params.ownerId);
    const rated = user.rate.getRatedPosts();
    return new GetRatedPosts.Success(user, convertDbRatedPosts(rated));
};

export const routes: RouteInfo[] = [
    { method: 'GET',  path: '/api/user/:id',       handler: getUser       },
    { method: 'GET',  path: '/api/posts',          handler: getPosts      },
    { method: 'POST', path: '/api/post',           handler: createPost    },
    { method: 'GET',  path: '/api/post/:id',       handler: getPost       },
    { method: 'POST', path: '/api/rate/post/:id',  handler: ratePost      },
    { method: 'GET',  path: '/api/rated/:ownerId', handler: getRatedPosts }
];
