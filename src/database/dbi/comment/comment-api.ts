import { ObjectId } from 'mongodb';
import { DbComment } from 'database/data-types';
import { BoundComment } from 'database/dbi/comment/bound-comment';
import { DatabaseInterface } from 'database/dbi/database-interface';

export class CommentAPI {

    constructor(private dbi: DatabaseInterface<DbComment>) { }

    async createComment(author: string, content: string): Promise<BoundComment> {
        const post: DbComment = {
            _id: new ObjectId(),
            author,
            content,
            dislikes: 0,
            likes: 0,
            replies: []
        };
        await this.dbi.create(post);
        return new BoundComment(this, post);
    }

    async readComment(id: string): Promise<BoundComment> {
        const comments = await this.dbi.read({ _id: new ObjectId(id) });
        return new BoundComment(this, comments[0]);
    }

    async updateComment(id: string, updates: Partial<DbComment>): Promise<void> {
        await this.dbi.update({ _id: new ObjectId(id) }, updates);
    }

    async deleteComment(id: string): Promise<void> {
        await this.dbi.delete({ _id: new ObjectId(id) });
    }

}
