import { Post } from 'interface/data-types';
import { DbPost } from 'database/post/post';
import { ObjectId } from 'mongodb';

export class PostWrapper implements DbPost {
    _id!: ObjectId;
    title!: string;
    likes!: number;
    content!: string;
    dislikes!: number;
    author!: ObjectId;
    comments!: ObjectId[];

    id: string;
    authorString: string;

    constructor(post: DbPost) {
        Object.assign(this, post);
        this.id = this._id.toHexString();
        this.authorString = this.author.toHexString();
    }

    toInterface(): Post {
        return {
            _id: this.id,
            author: this.authorString,
            comments: this.comments.map(objectId => objectId.toHexString()),
            content: this.content,
            date: this._id.generationTime,
            dislikes: this.dislikes,
            likes: this.likes,
            title: this.title
        };
    }
}
