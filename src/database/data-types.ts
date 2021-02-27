import { ObjectId } from 'mongodb';
import { Post, RatedPost, RatedPosts } from 'interface/data-types';

export interface DbPost {
    _id: ObjectId;
    author: ObjectId;
    comments: ObjectId[];
    content: string;
    dislikes: number;
    likes: number;
    title: string;
}

export interface DbRatedPost {
    _id: ObjectId;
    rating: -1 | 1;
}

export interface DbRatedPosts {
    _id: ObjectId;
    owner: ObjectId;
    posts: DbRatedPost[];
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

export function convertDbRatedPosts(dbRatedPosts: DbRatedPosts): RatedPosts {
    return {
        _id: dbRatedPosts._id.toHexString(),
        owner: dbRatedPosts.owner.toHexString(),
        posts: dbRatedPosts.posts.map(post => {
            return {
                _id: post._id.toHexString(),
                rating: post.rating
            } as RatedPost;
        })
    };
}
