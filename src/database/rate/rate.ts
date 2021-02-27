import { ObjectId } from 'mongodb';

export interface DbRatedPost {
    _id: ObjectId;
    rating: -1 | 1;
}

export interface DbRatedPosts {
    _id: ObjectId;
    owner: ObjectId;
    posts: DbRatedPost[];
}
