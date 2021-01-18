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
    author: string;
    content: string;
    dislikes: number;
    likes: number;
    replies: string[];
}

export interface RatedPost {
    _id: string;
    rating: -1 | 1;
}

export interface RatedPosts {
    _id: string;
    owner: string;
    posts: RatedPost[];
}
