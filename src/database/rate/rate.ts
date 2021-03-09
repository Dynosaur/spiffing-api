import { ObjectId } from 'mongodb';

export interface DbRates {
    _id: ObjectId;
    owner: ObjectId;
    posts: {
        liked: ObjectId[];
        disliked: ObjectId[];
    };
    comments: {
        liked: ObjectId[];
        disliked: ObjectId[];
    }
}
