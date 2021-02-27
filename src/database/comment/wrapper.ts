import { Comment } from 'interface/data-types';
import { ObjectId } from 'mongodb';
import { DbComment } from 'database/comment/comment';

export class CommentWrapper implements DbComment {
    _id!: ObjectId;
    author!: ObjectId;
    content!: string;
    dislikes!: number;
    likes!: number;
    parent!: {
        _id: ObjectId;
        contentType: 'post' | 'comment';
    };
    replies!: ObjectId[];

    id: string;
    authorString: string;

    constructor(db: DbComment) {
        Object.assign(this, db);
        this.id = this._id.toHexString();
        this.authorString = this.author.toHexString();
    }

    toInterface(): Comment {
        return {
            _id: this.id,
            author: this.authorString,
            content: this.content,
            dislikes: this.dislikes,
            likes: this.likes,
            parent: {
                _id: this.parent._id.toHexString(),
                contentType: this.parent.contentType
            },
            replies: this.replies.map(comment => comment.toHexString())
        };
    }
}
