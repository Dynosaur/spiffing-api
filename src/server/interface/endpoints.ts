// import { User, Post } from '../interface';
// import { Response } from './';

// export type MissingDataResponse = {
//     status: 'MISSING_DATA';
//     missing: {
//         data: string[];
//         count: number;
//         scope: string;
//     };
// };

// export type DecodeErrorResponse = {
//     status: 'E_AUTH_DECODE_PARSING';
//     field: 'username' | 'password';
//     message: string;
// };

// export type ExamineResponse = DecodeErrorResponse | MissingDataResponse | {
//     status: 'UNAUTHORIZED' | 'NO_USER' | 'USER_EXISTS';
// } | {
//     status: 'REQ_ERROR';
//     message: string;
// };

// export type UnauthorizedErrorResponse = {
//     status: 'E_UNAUTHORIZED';
// }

// export type UserExistsErrorResponse = {
//     status: 'E_USER_EXISTS';
// }

// export type UserNoExistErrorResponse = {
//     status: 'E_USER_NO_EXIST';
// }

// export type RegisterResponse = {
//     status: 'CREATED' | 'TEST_OK';
// } | UserExistsErrorResponse | DecodeErrorResponse;

// export type AuthenticateResponse = {
//     status: 'OK';
// } | DecodeErrorResponse | UnauthorizedErrorResponse | UserNoExistErrorResponse;

// export type DeregisterResponse = {
//     status: 'DELETED';
// }

// export type ExaminedResponse = IncompleteResponse | NoChangeResponse | MalformedResponse | RejectedResponse | { status: 'MISSING_RECORD'; message: string; };

// export type AuthenticateResponse = OkResponse | ExaminedResponse;

// export type RegisterResponse = CreatedResponse | OkResponse | ExaminedResponse;

// export class GetUserSuccessResponse extends DataResponse<User> {
//     public status: 'OK';
//     constructor(message: string, data: User) {
//         super('OK', message, data);
//     }
// }
// export type GetUserResponse = GetUserSuccessResponse | NoResultsResponse;

// export class GetPostsSuccessResponse extends DataResponse<Post[]> {
//     public status: 'OK';
//     constructor(message: string, data: Post[]) {
//         super('OK', message, data);
//     }
// }
// export type GetPostsResponse = GetPostsSuccessResponse | NoResultsResponse;

// export interface CreatePostRequest {
//     author: string;
//     title: string;
//     content: string;
// }
// export type CreatePostResponse = CreatedResponse | ExaminedResponse;

// export type DeregisterResponse = OkResponse | ExaminedResponse;

// export interface ChangeUserDataRequest {
//     username: string;
//     password: string;
// }
// export type ChangeUserDataResponse = {
//     status: 'OK';
//     updated: string[];
// } | ExaminedResponse;

// // interface GetPostSuccess extends Response3<'OK' | 'NOT_FOUND'> {
// //     status: 'OK';
// //     post: Post;
// // }
// // interface GetPostNotFound extends Response3<'OK' | 'NOT_FOUND'> { status: 'NOT_FOUND'; }
// // export type GetPostResponse = GetPostSuccess | GetPostNotFound;
// export type GetPostResponse = {
//     status: 'OK';
//     post: Post;
// } | {
//     status: 'NOT_FOUND';
// }
