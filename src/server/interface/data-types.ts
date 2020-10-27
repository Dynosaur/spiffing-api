export interface Post {
    title: string;
    content: string;
    author: string;
    date: number;
    id: string;
}

export interface User {
    username: string;
    screenName: string;
    created: number;
}

export interface MissingParamData {
    parameter: string;
    scope: string;
}

export interface LogInData {
    success: boolean;
}
