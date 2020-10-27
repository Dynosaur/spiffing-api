// import { CreatedResponse, GetPostsSuccessResponse, GetUserSuccessResponse, IncompleteResponse, MalformedResponse, NoResultsResponse, OkResponse, RejectedResponse } from '../server/interface/endpoints';
// import { HandlerReply, User, Post } from '../server';
// import { UserActions } from '../database';
// import { decodeBasicAuth } from '../tools';

// export function checkScope(scope: object, params: string[]): { ok: boolean, param: string } {
//     for (const param of params) {
//         if (scope[param] === undefined || scope[param] === null) {
//             return { ok: false, param };
//         }
//     }
//     return { ok: true, param: null };
// }

// export function createHandlerReply<T>(httpCode: number, message: string, payload: T): HandlerReply<T> {
//     return { httpCode, message, payload };
// }

// export function created(message: string): HandlerReply<CreatedResponse> {
//     return createHandlerReply<CreatedResponse>(201, message, new CreatedResponse(message));
// }

// export function incomplete(parameter: string, scope: string): HandlerReply<IncompleteResponse> {
//     const message = `Missing parameter ${parameter} in request ${scope}.`;
//     return createHandlerReply<IncompleteResponse>(400, message, new IncompleteResponse(message, parameter, scope));
// }

// export function malformed(message: string): HandlerReply<MalformedResponse> {
//     return createHandlerReply(400, message, new MalformedResponse(message));
// }

// export function noResults(message: string): HandlerReply<NoResultsResponse> {
//     return createHandlerReply<NoResultsResponse>(404, message, new NoResultsResponse(message));
// }

// export function ok(message: string): HandlerReply<OkResponse> {
//     return createHandlerReply<OkResponse>(200, message, new OkResponse(message));
// }

// export function rejected(httpCode: number, message: string): HandlerReply<RejectedResponse> {
//     return createHandlerReply<RejectedResponse>(httpCode, message, new RejectedResponse(message));
// }

// export function getPostsSuccess(posts: Post[]): HandlerReply<GetPostsSuccessResponse> {
//     const message = `Successfully found ${posts.length} posts.`;
//     return createHandlerReply(200, message, new GetPostsSuccessResponse(message, posts));
// }

// export function getUserSuccess(user: User): HandlerReply<GetUserSuccessResponse> {
//     const message = `Successfully found user "${user.username}".`;
//     return createHandlerReply(200, message, new GetUserSuccessResponse(message, user));
// }

// export interface Scope {
//     name: string;
//     scope: any;
//     params: string | string[];
//     require?: 'all' | 'none';
// }
// export function scopeCheck(checks: Scope[]): { ok: boolean; reply: HandlerReply<IncompleteResponse>; } {
//     for (const check of checks) {
//         const test = checkScope(check.scope, typeof check.params === 'string' ? [check.params] : check.params);
//         if (!test.ok) {
//             return { ok: false, reply: incomplete(test.param, check.name) };
//         }
//     }
//     return { ok: true, reply: null };
// }

// export async function tryAuthenticate(user: UserActions, username: string, authorization: string): Promise<{ ok: boolean, reply: HandlerReply<MalformedResponse | OkResponse | RejectedResponse> }> {
//     const decoded = decodeBasicAuth(authorization);
//     if (!decoded.ok) {
//         return { ok: false, reply: malformed(`Could not extract $${decoded.error} from Authorization header.`) };
//     }
//     if (decoded.username !== username) {
//         return { ok: false , reply: rejected(400, 'Request URL username does not match Authorization header username.') };
//     }

//     if (await user.isUsernameUnique(username)) {
//         return { ok: false, reply: rejected(404, `Could not authenticate user "${username}" because no such user exists.`) };
//     }

//     if (!await user.authenticate(username, decoded.password)) {
//         return { ok: false, reply: rejected(403, 'Unsuccessful authentication.') };
//     }

//     return { ok: true, reply: ok('Successful authentication.') };
// }

// export async function verifyUserExists(user: UserActions, username: string): Promise<{ ok: boolean, reply: HandlerReply<NoResultsResponse | OkResponse> }> {
//     if(await user.isUsernameUnique(username)) {
//         return { ok: false, reply: noResults(`User "${username}" does not exist.`) };
//     } else {
//         return { ok: true, reply: null };
//     }
// }