import { ObjectId } from 'mongodb';
import { SwitchMap } from 'tools/switch-map';
import { DbComment } from 'database/data-types/comment';
import { CommentAPI } from 'database/dbi/comment/comment-api';

export class BoundComment {
    alive = true;
    private changed = new SwitchMap<keyof DbComment>();

    constructor(private actions: CommentAPI, private dbComment: DbComment) {}

    getObjectId(): ObjectId {
        return new ObjectId(this.dbComment._id);
    }

    getStringId(): string {
        return this.dbComment._id.toHexString();
    }

    getContent(): string {
        return this.dbComment.content;
    }

    setContent(content: string): void {
        this.dbComment.content = content;
        this.changed.on('content');
    }

    setAuthor(author: ObjectId): void {
        this.dbComment.author = author;
        this.changed.on('author');
    }

    addReply(comment: BoundComment): void {
        this.dbComment.replies.push(comment.getObjectId());
        this.changed.on('replies');
    }

    async flush(): Promise<void> {
        if (!this.alive)
            throw new Error(`Attempted to flush changes to ${this.getStringId()}, but is no longer alive.`);
        const comment = await this.actions.readComment(this.getStringId());
        if (comment === null) {
            this.alive = false;
            throw new Error(`Attempted to flush changes to comment ${this.getStringId()}, but it no longer exists.`);
        }
        const changes: Partial<DbComment> = {};
        for (const key of this.changed.keys()) (changes as any)[key] = this.dbComment[key];
        if (Object.keys(changes).length === 0) return;
        await this.actions.updateComment(this.getStringId(), changes);
    }

    async delete(): Promise<void> {
        if (this.dbComment.replies.length > 0) {
            this.setAuthor(null);
            this.setContent(null);
            await this.flush();
        } else {
            await this.actions.deleteComment(this.getStringId());
            this.alive = false;
        }
    }
}
