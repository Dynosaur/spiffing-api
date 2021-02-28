import { DbPost } from 'database/post';
import { DbUser } from 'database/user';
import { Post, User } from 'interface/data-types';
import { decodeBasicAuth } from 'tools/auth';
import { scopeMustHaveProps } from 'route-handling/route-handler';
import { FilterQuery, ObjectId } from 'mongodb';
import { objectIdParseErrorMessage } from '../../error-messages';
import { RouteInfo, RouteHandler, RoutePayload } from 'route-handling/route-infra';
import {
    CreatePost,
    DeleteComment,
    GetPosts,
    GetRatedPosts,
    GetUsers,
    PostComment,
    RatePost
} from 'interface-bindings/api-responses';
import {
    ICreatePost,
    IDeleteComment,
    IGetPosts,
    IGetRatedPosts,
    IGetUsers,
    IPostComment,
    IRatePost
} from 'interface/responses/api-responses';
import {
    AuthHeaderIdParamError,
    IllegalValueError,
    MissingDataError,
    NoCommentFoundError,
    NoPostFoundError,
    ObjectIdParseError,
    UnauthenticatedError,
    UnauthorizedError
} from 'interface-bindings/error-responses';

function query(accepted: string[], query: object): { allowed: string[]; blocked: string[]; } {
    if (Object.keys(query).length === 0) return { allowed: [], blocked: [] };
    const allowed: string[] = [];
    const blocked: string[] = [];
    for (const q in query)
        if (accepted.includes(q)) allowed.push(q);
        else blocked.push(q);
    return { allowed, blocked };
}

export const getPosts: RouteHandler<IGetPosts.Tx> = async function getPosts(request, actions): Promise<RoutePayload<IGetPosts.Tx>> {
    let posts: Post[] = [];
    const failed: any = {};
    const allowed: string[] = [];
    const blocked: string[] = [];
    if (Object.keys(request.query).length === 0) {
        const boundPosts = await actions.post.getManyByQuery({});
        posts = boundPosts.map(post => post.toInterface());
    } else {
        const allowedKeys = ['author', 'id', 'ids', 'include', 'title'];
        const dbQuery: FilterQuery<DbPost> = {};
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
                        const ids = queryValue.match(/[a-f\d]{24}/g);
                        if (ids === null) {
                            failed.ids = { error: 'No ObjectIds could be found', value: queryValue };
                            break;
                        }
                        const failedIds: string[] = [];
                        const objectIds: ObjectId[] = [];
                        for (const match of ids)
                            try {
                                objectIds.push(new ObjectId(match));
                            } catch (e) {
                                if (e.message === objectIdParseErrorMessage) failedIds.push(match);
                                else throw e;
                            }
                        if (failedIds.length) failed.ids = failedIds;
                        if (objectIds.length) dbQuery._id = { $in: objectIds };
                        break;
                    }
                    case 'include':
                        break;
                    default:
                        (dbQuery as any)[query] = queryValue;
                        break;
                }
            } else blocked.push(query);
        }
        const boundPosts = await actions.post.getManyByQuery(dbQuery);
        posts = boundPosts.map(post => post.toInterface());
    }
    if (request.query.include === 'authorUser') {
        const authorMap = new Map<string, User>();
        for (const post of posts) authorMap.set(post.author as string, null as any);
        const authors = await actions.user.getManyById(Array.from(authorMap.keys()).map(id => new ObjectId(id)));
        authors.forEach(author => authorMap.set(author.id, author.toInterface()));
        posts.forEach(post => {
            post.author = post.author as string;
            if (authorMap.has(post.author)) (post as any).author = authorMap.get(post.author);
        });
    }
    return new GetPosts.Success(posts, allowed, blocked, failed);
};

export const createPost: RouteHandler<ICreatePost.Tx> = async function createPost(request, actions): Promise<RoutePayload<ICreatePost.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();
    const bodyError = scopeMustHaveProps(request.body, 'body', ['content', 'title']);
    if (bodyError) return bodyError;

    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;

    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();
    const post = await actions.post.create(user._id, request.body.title, request.body.content);
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
    const post = await actions.post.get(postId);
    if (!post) return new NoPostFoundError(postId.toHexString());
    let result = false;
    let rate = await actions.user.getUserRateApi(user._id);
    switch (rating) {
        case -1:
            result = await rate.dislikePost(post._id);
            break;
        case 0:
            result = await rate.unratePost(post._id);
            break;
        case 1:
            result = await rate.likePost(post._id);
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
    let rate = await actions.user.getUserRateApi(user._id);
    return new GetRatedPosts.Success(user, rate.getInterfaceRatedPosts());
};

export const getUsers: RouteHandler<IGetUsers.Tx> = async function getUsers(request, actions): Promise<RoutePayload<IGetUsers.Tx>> {
    const queryCheck = query(['id', 'ids', 'username', 'usernames'], request.query);
    const databaseQuery: FilterQuery<DbUser> = {};
    queryCheck.allowed.forEach(key => {
        switch (key) {
            case 'id':
                request.query.id = request.query.id as string;
                let id: ObjectId;
                try {
                    id = new ObjectId(request.query.id);
                } catch (error) {
                    if (error.message === objectIdParseErrorMessage) return new ObjectIdParseError(request.query.id);
                    else throw error;
                }
                databaseQuery._id = id;
                break;
            case 'ids':
                request.query.ids = request.query.ids as string;
                const ids = Array.from(request.query.ids.matchAll(/([a-f\d]{24})/g)).map(regexMatch => regexMatch[1]);
                if (ids.length === 0) break;
                const objectIds = ids.map(id => new ObjectId(id));
                databaseQuery._id = { $in: objectIds };
                break;
            case 'username':
                databaseQuery.username = request.query.username as string;
                break;
            case 'usernames':
                databaseQuery.username = { $in: (request.query.usernames as string).split(',') };
                break;
        }
        return;
    });
    const users: User[] = (await actions.user.getByQuery(databaseQuery)).map(user => user.toInterface());
    return new GetUsers.Success(users, queryCheck.allowed, queryCheck.blocked);
};

export const postComment: RouteHandler<IPostComment.Tx> = async function postComment(request, actions): Promise<RoutePayload<IPostComment.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();
    if (!request.body.hasOwnProperty('content'))
        return new MissingDataError('body', Object.keys(request.body), ['content']);
    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;
    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();
    if (request.params.contentType === 'post') {
        const post = await actions.post.get(request.params.id);
        if (post === null) return new NoPostFoundError(request.params.id);
        const comment = await actions.comment.create(user._id, request.body.content, 'post', post._id);
        return new PostComment.Success(comment);
    } else if (request.params.contentType === 'comment') {
        const comment = await actions.comment.get(request.params.id);
        if (comment === null) return new NoCommentFoundError(request.params.id);
        const subcomment = await actions.comment.create(user._id, request.body.content, 'comment', comment._id);
        return new PostComment.Success(subcomment);
    } else return new IllegalValueError(request.params.contentType, ['post', 'comment'], 'params');
};

export const deleteComment: RouteHandler<IDeleteComment.Tx> = async function deleteComment(request, actions): Promise<RoutePayload<IDeleteComment.Tx>> {
    if (!request.headers.authorization) return new UnauthenticatedError();
    const decodeAttempt = decodeBasicAuth(request.headers.authorization);
    if (decodeAttempt instanceof RoutePayload) return decodeAttempt;
    const user = await actions.common.authorize(decodeAttempt.username, decodeAttempt.password);
    if (!user) return new UnauthorizedError();
    const comment = await actions.comment.get(request.params.commentId);
    if (comment === null) return new NoCommentFoundError(request.params.commentId);
    if (user.id !== comment.authorString) return new UnauthorizedError();
    const deleteResult = await actions.comment.delete(comment.id);
    return new DeleteComment.Success(comment, deleteResult);
};

export const routes: RouteInfo[] = [
    { method: 'GET',    path: '/api/posts',              handler: getPosts      },
    { method: 'POST',   path: '/api/post',               handler: createPost    },
    { method: 'POST',   path: '/api/rate/post/:id',      handler: ratePost      },
    { method: 'GET',    path: '/api/rated/:ownerId',     handler: getRatedPosts },
    { method: 'GET',    path: '/api/users',              handler: getUsers      },
    { method: 'POST',   path: '/api/:contentType/:id',   handler: postComment   },
    { method: 'DELETE', path: '/api/comment/:commentId', handler: deleteComment }
];
