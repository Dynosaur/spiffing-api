import { PostAPI } from 'database/dbi/post-actions';
import { Comment } from 'interface/data-types';
import { ObjectId } from 'mongodb';
import { SwitchMap } from 'tools/switch-map';
import { DbComment } from 'database/comment/comment';
import { CommentAPI } from 'database/comment/api';
import { defensiveCopy } from 'tools/copy';

export class BoundComment {
    alive = true;
    private changed = new SwitchMap<keyof DbComment>();

    constructor(private actions: CommentAPI, private postApi: PostAPI, private dbComment: DbComment) {}

    toInterface(): Comment {
        return {
            _id: this.getStringId(),
            author: this.getStringAuthor(),
            content: this.getContent(),
            dislikes: this.dbComment.dislikes,
            likes: this.dbComment.likes,
            parent: {
                _id: this.dbComment.parent._id.toHexString(),
                contentType: this.dbComment.parent.contentType
            },
            replies: this.dbComment.replies.map(comment => comment.toHexString())
        };
    }

    getObjectId(): ObjectId {
        return new ObjectId(this.dbComment._id);
    }

    getStringId(): string {
        return this.dbComment._id.toHexString();
    }

    getObjectAuthor(): ObjectId {
        return new ObjectId(this.dbComment.author);
    }

    getStringAuthor(): string {
        return this.dbComment.author.toHexString();
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

    getReplies(): ObjectId[] {
        return this.dbComment.replies.map(subcommentId => new ObjectId(subcommentId));
    }

    setReplies(replies: ObjectId[]): void {
        this.dbComment.replies = replies;
        this.changed.on('replies');
    }

    getDbComment(): DbComment {
        return defensiveCopy(this.dbComment);
    }

    async flush(): Promise<void> {
        if (!this.alive)
            throw new Error(`Attempted to flush changes to ${this.getStringId()}, but is no longer alive.`);
        const comment = await this.actions.readComment(this.getStringId());
        if (comment === null) {
            this.alive = false;
            throw new Error(`Attempted to flush changes to comment ${this.getStringId()}, but it no longer exists.`);
        }
        if (Array.from(this.changed.keys()).length === 0) return;
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
            const parent = this.dbComment.parent;
            if (parent.contentType === 'comment') {
                const parentComment = await this.actions.readComment(parent._id.toHexString());
                let index: number;
                const parentReplies = parentComment.getReplies();
                for (let i = 0; i < parentReplies.length; i++) {
                    const parentSubcommentId = parentReplies[i];
                    if (parentSubcommentId.toHexString() === this.getStringId()) {
                        index = i;
                        break;
                    }
                }
                parentReplies.splice(index, 1);
                parentComment.setReplies(parentReplies);
                await parentComment.flush();
            } else {
                const parentPost = await this.postApi.readPost(parent._id);
                parentPost.deleteComment(this);
                await parentPost.flush();
            }
            await this.actions.deleteComment(this.getStringId());
            this.alive = false;
        }
    }

    async sync(): Promise<void> {
        const comment = await this.actions.readComment(this.getStringId());
        if (comment === null) {
            this.alive = false;
            return;
        }
        this.dbComment = comment.dbComment;
    }
}
