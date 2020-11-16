export interface Post {
    title: string;
    content: string;
    author: string;
    date: number;
    id: string;
}

export interface User {
    _id: string;
    created: number;
    screenname: string;
    username: string;
}

export interface MissingParamData {
    parameter: string;
    scope: string;
}

export interface LogInData {
    success: boolean;
}
