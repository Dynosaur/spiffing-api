import { DbPost } from 'database/post';
import { DatabaseInterface } from 'database/database-interface';
import { ObjectId, UpdateQuery } from 'mongodb';
import { CommentWrapper, DbComment } from 'database/comment';

export async function createComment(
    author: ObjectId,
    content: string,
    parentType: 'post' | 'comment',
    parentId: ObjectId,
    commentDbi: DatabaseInterface<DbComment>,
    postDbi: DatabaseInterface<DbPost>
): Promise<CommentWrapper> {
    const comment = await commentDbi.create({
        parent: {
            _id: parentId,
            contentType: parentType
        },
        author, content,
        dislikes: 0, likes: 0,
        replies: []
    });
    if (parentType === 'post') await postDbi.updateOne({ _id: parentId }, { $push: { comments: comment._id } });
    else await commentDbi.updateOne({ _id: parentId }, { $push: { replies: comment._id } });
    return new CommentWrapper(comment);
}

export async function deleteComment(
    id: ObjectId | string,
    commentDbi: DatabaseInterface<DbComment>,
    postDbi: DatabaseInterface<DbPost>
): Promise<boolean> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const comment = await commentDbi.get({ _id: objectId });
    if (comment === null) throw new Error(`Could not delete comment ${id}: does not exist.`);
    if (comment.replies.length > 0) {
        await commentDbi.updateOne({ _id: objectId }, { $set: { author: undefined, content: undefined } });
        return false;
    }
    if (comment.parent.contentType === 'post')
        await postDbi.updateOne({ _id: comment.parent._id }, { $pull: { comments: objectId } });
    else await commentDbi.updateOne({ _id: comment.parent._id }, { $pull: { replies: objectId } });
    await commentDbi.delete({ _id: new ObjectId(id) });
    return true;
}

export class CommentAPI {
    constructor(private comments: DatabaseInterface<DbComment>, private posts: DatabaseInterface<DbPost>) { }

    async create(author: ObjectId, content: string, parentType: 'post' | 'comment', parentId: ObjectId): Promise<CommentWrapper> {
        return createComment(author, content, parentType, parentId, this.comments, this.posts);
    }

    async get(id: string): Promise<CommentWrapper | null> {
        const comment = await this.comments.get({ _id: new ObjectId(id) });
        return comment === null ? null : new CommentWrapper(comment);
    }

    update(id: string, updates: UpdateQuery<DbComment>): Promise<void> {
        return this.comments.updateOne({ _id: new ObjectId(id) }, updates);
    }

    delete(id: string): Promise<boolean> {
        return deleteComment(id, this.comments, this.posts);
    }
}
