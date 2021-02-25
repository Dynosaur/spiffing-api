import { Comment } from 'interface/data-types';
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

export function convertDbComment(dbComment: DbComment): Comment {
    return {
        _id: dbComment._id.toHexString(),
        author: dbComment.author.toHexString(),
        content: dbComment.content,
        dislikes: dbComment.dislikes,
        likes: dbComment.likes,
        replies: dbComment.replies.map(_id => _id.toHexString())
    };
}
