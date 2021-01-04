import { ObjectId } from 'mongodb';
import { Comment, Post, User } from 'interface/data-types';

export interface Password {
    hash: string;
    salt: string;
}

export interface DbUser {
    _id: ObjectId;
    password: Password;
    screenname: string;
    username: string;
}

export interface DbPost {
    _id: ObjectId;
    author: ObjectId;
    comments: ObjectId[];
    content: string;
    dislikes: number;
    likes: number;
    title: string;
}

export interface DbComment {
    _id: ObjectId;
    author: string;
    content: string;
    dislikes: number;
    likes: number;
    replies: ObjectId[];
}

export interface RatedPost {
    _id: ObjectId;
    rating: -1 | 1;
}

export interface DbRatedPosts {
    _id: ObjectId;
    owner: ObjectId;
    posts: RatedPost[];
}

export function convertDbUser(dbUser: DbUser): User {
    return {
        _id: dbUser._id.toHexString(),
        created: dbUser._id.generationTime,
        screenname: dbUser.screenname,
        username: dbUser.username
    };
}

export function convertDbPost(dbPost: DbPost): Post {
    return {
        _id: dbPost._id.toHexString(),
        author: dbPost.author.toHexString(),
        comments: dbPost.comments.map(_id => _id.toHexString()),
        content: dbPost.content,
        date: dbPost._id.generationTime,
        dislikes: dbPost.dislikes,
        likes: dbPost.likes,
        title: dbPost.title
    };
}

export function convertDbComment(dbComment: DbComment): Comment {
    return {
        _id: dbComment._id.toHexString(),
        author: dbComment.author,
        content: dbComment.content,
        dislikes: dbComment.dislikes,
        likes: dbComment.likes,
        replies: dbComment.replies.map(_id => _id.toHexString())
    };
}
