import { ObjectId } from 'mongodb';
import { BoundUser } from 'database/dbi/user-api';
import { Post, User } from 'interface/data-types';
import { decodeBasicAuth } from 'tools/auth';
import { scopeMustHaveProps } from 'route-handling/route-handler';
import { objectIdParseErrorMessage } from 'app/error-messages';
import { convertDbRatedPosts, DbPost } from 'database/data-types';
import { RouteInfo, RouteHandler, RoutePayload } from 'route-handling/route-infra';
import { CreatePost, GetPost, GetPosts, GetRatedPosts, GetUser, GetUsers, RatePost } from 'interface-bindings/api-responses';
import { ICreatePost, IGetPost, IGetPosts, IGetRatedPosts, IGetUser, IGetUsers, IRatePost } from 'interface/responses/api-responses';
import { AuthHeaderIdParamError, MissingDataError, NoPostFoundError, NoUserFoundError, ObjectIdParseError, UnauthenticatedError, UnauthorizedError } from 'interface-bindings/error-responses';

/**
 * @deprecated
 */
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
    let posts: Post[] = [];
    const allowed: string[] = [];
    const blocked: string[] = [];
    if (Object.keys(request.query).length === 0) {
        const boundPosts = await actions.post.readPosts({});
        posts = boundPosts.map(post => post.toInterface());
    } else {
        const allowedKeys = ['author', 'id', 'ids', 'include', 'title'];
        const dbQuery: Partial<DbPost> = {};
        for (const query in request.query) {
            const queryValue = request.query[query] as string;
            if (allowedKeys.includes(query)) {
                allowed.push(query);
                switch (query) {
                    case 'author':
                        try {
                            dbQuery.author = new ObjectId(queryValue);
                        } catch (error) {
                            if (error.message === objectIdParseErrorMessage)
                                return new ObjectIdParseError(queryValue);
                            else throw error;
                        }
                        break;
                    case 'id':
                        try {
                            dbQuery._id = new ObjectId(queryValue);
                        } catch (error) {
                            if (error.message === objectIdParseErrorMessage)
                                return new ObjectIdParseError(queryValue);
                            else throw error;
                        }
                        break;
                    case 'ids': {
                        const ids = queryValue.match(/[a-f\d]{24}/g).map(match => new ObjectId(match));
                        dbQuery._id = { $in: ids } as any;
                        break;
                    }
                    case 'include':
                        break;
                    default:
                        dbQuery[query] = queryValue;
                        break;
                }
            } else blocked.push(query);
        }
        const boundPosts = await actions.post.readPosts(dbQuery);
        posts = boundPosts.map(post => post.toInterface());
    }
    if (request.query.include === 'authorUser') {
        const authorMap = new Map<string, User>();
        for (const post of posts) authorMap.set(post.author as string, null);
        const authors = await actions.user.getUsersById(Array.from(authorMap.keys()).map(id => new ObjectId(id)));
        authors.forEach(author => authorMap.set(author._id.toHexString(), author.toInterface()));
        posts.forEach(post => {
            post.author = post.author as string;
            if (authorMap.has(post.author)) post.author = authorMap.get(post.author);
        });
    }
    return new GetPosts.Success(posts, allowed, blocked);
};

/**
 * @deprecated
 */
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
    let rate = await user.getRateApi();
    switch (rating) {
        case -1:
            result = await rate.dislikePost(post);
            break;
        case 0:
            result = await rate.unratePost(post);
            break;
        case 1:
            result = await rate.likePost(post);
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
    let rate = await user.getRateApi();
    const rated = rate.getRatedPosts();
    return new GetRatedPosts.Success(user, convertDbRatedPosts(rated));
};

export const getUsers: RouteHandler<IGetUsers.Tx> = async function getUsers(request, actions): Promise<RoutePayload<IGetUsers.Tx>> {
    const queryCheck = scopeMustHaveProps(request.query, 'query', ['ids']);
    if (queryCheck) return queryCheck;
    const ids = Array.from((request.query.ids as string).matchAll(/([a-f\d]{24})/g)).map(tingy => tingy[1]);
    const users: User[] = [];
    const missingIds: string[] = [];
    while (ids.length) {
        const id = ids.shift();
        const user = await actions.user.readUser({ _id: new ObjectId(id) });
        if (user) users.push(user.toInterface());
        else missingIds.push(id);
    }
    return new GetUsers.Success(users, missingIds);
};

export const routes: RouteInfo[] = [
    { method: 'GET',  path: '/api/user/:id',       handler: getUser       },
    { method: 'GET',  path: '/api/posts',          handler: getPosts      },
    { method: 'POST', path: '/api/post',           handler: createPost    },
    { method: 'GET',  path: '/api/post/:id',       handler: getPost       },
    { method: 'POST', path: '/api/rate/post/:id',  handler: ratePost      },
    { method: 'GET',  path: '/api/rated/:ownerId', handler: getRatedPosts },
    { method: 'GET',  path: '/api/users',          handler: getUsers      }
];
