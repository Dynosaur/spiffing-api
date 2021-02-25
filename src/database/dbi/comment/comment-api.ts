import { ObjectId } from 'mongodb';
import { DbComment } from 'database/data-types/comment';
import { BoundComment } from 'database/dbi/comment/bound-comment';
import { DatabaseInterface } from 'database/dbi/database-interface';
import { BoundPost, PostAPI } from 'database/dbi/post-actions';

export class CommentAPI {
    postApi: PostAPI;
    constructor(public dbi: DatabaseInterface<DbComment>) { }

    async createComment(author: ObjectId, content: string, parent: BoundPost | BoundComment): Promise<BoundComment> {
        let contentType: 'post' | 'comment';
        let parentId: ObjectId;
        if (parent instanceof BoundPost) {
            contentType = 'post';
            parentId = parent.getObjectId();
        } else {
            contentType = 'comment';
            parentId = parent.getObjectId();
        }
        const post: DbComment = {
            replies: [],
            _id: undefined,
            author, content,
            likes: 0, dislikes: 0,
            parent: {
                contentType,
                _id: parentId
            }
        };
        await this.dbi.create(post);
        const boundComment = new BoundComment(this, this.postApi, post);
        if (parent instanceof BoundPost) {
            parent.addComment(boundComment);
            await parent.flush();
        } else {
            parent.addReply(boundComment);
            await parent.flush();
        }
        return boundComment;
    }

    async readComment(id: string): Promise<BoundComment> {
        const comments = await this.dbi.read({ _id: new ObjectId(id) });
        if (comments.length === 0) return null;
        return new BoundComment(this, this.postApi, comments[0]);
    }

    async updateComment(id: string, updates: Partial<DbComment>): Promise<void> {
        await this.dbi.update({ _id: new ObjectId(id) }, updates);
    }

    async deleteComment(id: string): Promise<void> {
        await this.dbi.delete({ _id: new ObjectId(id) });
    }

}
