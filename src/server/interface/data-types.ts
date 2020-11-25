export interface Post {
    _id: string;
    author: string;
    content: string;
    date: number;
    title: string;
}

export interface User {
    _id: string;
    created: number;
    screenname: string;
    username: string;
}
