import { ObjectId } from 'mongodb';

export interface DbComment {
    _id: ObjectId;
    likes: number;
    author: ObjectId;
    content: string;
    dislikes: number;
    replies: ObjectId[];
    parent: {
        contentType: 'post' | 'comment';
        _id: ObjectId;
    }
}
