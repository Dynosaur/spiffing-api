import { ObjectId } from 'mongodb';

export interface DbPost {
    _id: ObjectId;
    author: ObjectId;
    comments: ObjectId[];
    content: string;
    dislikes: number;
    likes: number;
    title: string;
}
