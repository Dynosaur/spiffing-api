import { FilterQuery, ObjectId, UpdateQuery } from 'mongodb';
import { DbComment }           from 'database/comment';
import { DatabaseInterface }   from 'database/database-interface';
import { DbPost, PostWrapper } from 'database/post';
import { DbRates }             from 'database/rate';

export async function deletePost(
    _id: ObjectId,
    postInterface: DatabaseInterface<DbPost>,
    commentInterface: DatabaseInterface<DbComment>,
    rateInterface: DatabaseInterface<DbRates>
): Promise<void> {
    const commentsOnPost = await commentInterface.getMany({
        'parent._id': _id,
        'parent.contentType': 'post'
    });
    if (commentsOnPost.length) {
        await postInterface.updateOne({ _id }, { $set: {
            author: undefined,
            content: undefined,
            title: undefined
        } });
        return;
    }
    await postInterface.delete({ _id });
    await rateInterface.updateMany(
        { 'posts.liked': _id },
        { $pull: { 'posts.liked': _id } },
        undefined, false
    );
    await rateInterface.updateMany(
        { 'posts.disliked': _id },
        { $pull: { 'posts.disliked': _id } },
        undefined, false
    );
}

export class PostAPI {
    constructor(private postDbi: DatabaseInterface<DbPost>,
                private commentDbi: DatabaseInterface<DbComment>,
                private rateDbi: DatabaseInterface<DbRates>) {}

    async create(author: ObjectId, title: string, content: string): Promise<PostWrapper> {
        const post = await this.postDbi.create({
            likes: 0,
            dislikes: 0,
            comments: [],
            author, content, title
        });
        return new PostWrapper(post);
    }

    async get(id: ObjectId): Promise<PostWrapper | null> {
        const post = await this.postDbi.get({ _id: typeof id === 'string' ? new ObjectId(id) : id });
        return post === null ? null : new PostWrapper(post);
    }

    async getManyByQuery(query: FilterQuery<DbPost>): Promise<PostWrapper[]> {
        const posts = await this.postDbi.getMany(query);
        return posts.map(post => new PostWrapper(post));
    }

    update(id: string, updates: UpdateQuery<DbPost>): Promise<void> {
        return this.postDbi.updateOne({ _id: new ObjectId(id) }, updates);
    }

    delete(id: ObjectId): Promise<void> {
        return deletePost(id, this.postDbi, this.commentDbi, this.rateDbi);
    }
}
