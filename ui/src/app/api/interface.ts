// data types

export interface Post {
    _id: string;
    author: string | User;
    comments: string[];
    content: string;
    date: number;
    dislikes: number;
    likes: number;
    title: string;
}

export interface User {
    _id: string;
    created: number;
    screenname: string;
    username: string;
}

export interface Comment {
    _id: string;
    author: string | User;
    content: string;
    created: number;
    dislikes: number;
    likes: number;
    replies: string[];
    parent: {
        _id: string;
        contentType: 'post' | 'comment';
    }
}

export interface Rates {
    _id: string;
    owner: string;
    comments: {
        liked: string[];
        disliked: string[];
    }
    posts: {
        liked: string[];
        disliked: string[];
    }
}

// error\authorization-parse.ts

export type FailedPart = 'Authorization Type' | 'Username' | 'Password';

export interface IAuthorizationParse {
    error: 'Authorization Header Parse';
    ok: false;
    part: FailedPart;
}

// error\content-not-found.ts

export type Content = 'Comment' | 'Post' | 'User';

export interface IContentNotFound {
    content: Content;
    error: 'Content Not Found';
    id: string;
    ok: false;
}

// error\illegal-value.ts

export interface IIllegalValue {
    allowed: any;
    context: string;
    error: 'Illegal Value';
    ok: false;
    value: any;
}

// error\missing.ts

export interface IMissing {
    allowedValues?: string[];
    error: 'Missing Item';
    field: string;
    name: string;
    ok: false;
}

// error\object-id-parse.ts

export interface IObjectIdParse {
    context: string;
    error: 'Object Id Parse';
    ok: false;
    provided: string;
}

// error\unauthenticated.ts

export interface IUnauthenticated {
    error: 'Unauthenticated';
    ok: false;
}

// error\unauthorized.ts

export interface IUnauthorized {
    error: 'Unauthorized';
    ok: false;
}

export namespace IAuthorize {
    export type ErrTx = IAuthorizationParse | IUnauthenticated | IUnauthorized;

    export interface Success {
        ok: true;
        user: User;
    }

    export type Tx = ErrTx | Success;
}

export namespace ICreateComment {
    export type ErrorTx =
        | IAuthorizationParse
        | IContentNotFound
        | IIllegalValue
        | IMissing
        | IObjectIdParse
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        comment: Comment;
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IDeleteComment {
    export type ErrorTx =
        | IAuthorizationParse
        | IContentNotFound
        | IObjectIdParse
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        fullyDeleted: boolean;
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IGetComment {
    export type ErrorTx =
        | IIllegalValue
        | IMissing
        | IObjectIdParse;

    export interface Success {
        acceptedParams?: string[];
        comments: Comment[];
        ignoredParams?: string[];
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

export namespace ICreatePost {
    export type ErrorTx =
        | IAuthorizationParse
        | IMissing
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        ok: true;
        post: Post;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IDeletePost {
    type ErrorTx =
        | IAuthorizationParse
        | IMissing
        | IObjectIdParse
        | IContentNotFound
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IGetPost {
    export type ErrorTx = IObjectIdParse;

    export interface Success {
        failed?: Record<string, any>;
        ok: true;
        posts: Post[];
        'query-allowed'?: string[];
        'query-blocked'?: string[];
    }

    export type Tx = ErrorTx | Success;
}

export namespace IRateComment {
    export type ErrorTx =
        | IAuthorizationParse
        | IContentNotFound
        | IMissing
        | IObjectIdParse
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        change: boolean;
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IGetRate {
    export type ErrorTx = IAuthorizationParse | IUnauthenticated | IUnauthorized;

    export interface Success {
        ok: true;
        rates: Rates;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IRatePost {
    export type ErrorTx =
        | IAuthorizationParse
        | IContentNotFound
        | IMissing
        | IObjectIdParse
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        changed: boolean;
        ok: true;
    }

    export type Tx = ErrorTx | Success;
}

export namespace ICreateUser {
    export interface IUsernameTaken {
        error: 'Username Taken';
        ok: false;
    }

    export type ErrorTx = IAuthorizationParse | IUnauthenticated | IUsernameTaken;

    export interface Success {
        ok: true;
        user: User;
    }

    export type Tx = ErrorTx | Success;
}

export namespace IDeleteUser {
    export type ErrTx =
        | IAuthorizationParse
        | IObjectIdParse
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        ok: true;
    }

    export type Tx = ErrTx | Success;
}

export namespace IGetUser {
    export type ErrorTx = IObjectIdParse;

    export interface Success {
        'allowed-queries'?: string[];
        'blocked-queries'?: string[];
        ok: true;
        users: User[];
    }

    export type Tx = ErrorTx | Success;
}

export namespace IUpdateUser {
    export type ErrTx =
        | IAuthorizationParse
        | IUnauthenticated
        | IUnauthorized;

    export interface Success {
        ok: true;
        rejected: string[];
        updated: string[];
    }

    export type Tx = ErrTx | Success;
}