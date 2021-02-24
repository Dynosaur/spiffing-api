import { ObjectId } from 'mongodb';
import { DbComment } from 'database/data-types';
import { CommentAPI } from 'database/dbi/comment/comment-api';

export class BoundComment implements DbComment {

    _id: ObjectId;
    author: string;
    content: string;
    dislikes: number;
    likes: number;
    replies: ObjectId[];

    constructor(private actions: CommentAPI, obj: DbComment) {
        Object.assign(this, obj);
    }

}
