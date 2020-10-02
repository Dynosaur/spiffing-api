import { User, Post, MissingParamData, Response, DataResponse } from '../interface';

export type NoParams = { };
export interface TxNoResults extends Response { status: 'NO_RESULTS'; }
export interface TxMissingParam extends DataResponse<MissingParamData> { status: 'INCOMPLETE'; }
export interface TxOk extends Response { status: 'OK'; }
export interface TxRejected extends Response { status: 'REJECTED'; }
export interface TxCreated extends Response { status: 'CREATED'; }

// interface HeaderObject {
//     [header: string]: string;
// }

// export interface Action<Tx extends object = {}, Rx extends object = {}, Qx extends object = {}, Px = {}, Hx extends HeaderObject = {}> {
//     response: Tx;
//     body: Rx;
//     query: Qx;
//     params: Px;
//     headers: Hx;
// }

export interface DefaultOk extends Response { status: 'OK'; }
export interface DefaultMalformed extends Response { status: 'MALFORMED'; }
export interface DefaultMissingParam extends Response { status: 'INCOMPLETE'; }
export interface DefaultRejected extends Response { status: 'REJECTED'; }

export namespace Authenticate {
    // export interface Act extends Action<TxOk | TxRejected, {}, {}, {}, { Authorization: string }> { }
    export type Response = DefaultMalformed | DefaultMissingParam | DefaultOk | DefaultRejected;
}

export namespace Register {
    // export interface Act extends Action<TxCreated | TxOk | TxRejected | TxMissingParam, {}, { test: boolean }, {}, { Authorization: string; }> { }
    export interface Created extends DataResponse<User> { status: 'CREATED'; }
    export type Response = Created | DefaultMalformed | DefaultOk | DefaultRejected;
}

export namespace GetUser {
    export interface Success extends DataResponse<User> { status: 'OK'; }
    export interface TxSuccess extends DataResponse<User> { status: 'OK'; }
    // export interface Act extends Action<TxSuccess | TxNoResults, {}, {}, { username: string }, {}> { }
}

export namespace GetPosts {
    export interface Success extends DataResponse<Post[]> { status: 'OK'; }
    export type NoResults = TxNoResults;
}

export namespace CreatePost {
    // export interface Act extends Action<TxCreated | TxMissingParam, { title: string; content: string; author: string; }, {}, {}> { }
}
