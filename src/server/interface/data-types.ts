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
