import { FilterQuery, ObjectId, UpdateQuery } from 'mongodb';
import { DbComment }           from 'database/comment';
import { DatabaseInterface }   from 'database/database-interface';
import { DbPost, PostWrapper } from 'database/post';

export async function deletePost(
    _id: ObjectId,
    postInterface: DatabaseInterface<DbPost>,
    commentInterface: DatabaseInterface<DbComment>
): Promise<void> {
    await postInterface.delete({ _id });
    await commentInterface.deleteMany({ parent: { _id, contentType: 'post' } });
}

export class PostAPI {
    constructor(private postDbi: DatabaseInterface<DbPost>, private commentDbi: DatabaseInterface<DbComment>) {}

    async create(author: ObjectId, title: string, content: string): Promise<PostWrapper> {
        const post = await this.postDbi.create({
            likes: 0,
            dislikes: 0,
            comments: [],
            author, content, title
        });
        return new PostWrapper(post);
    }

    async get(id: ObjectId | string): Promise<PostWrapper | null> {
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
        return deletePost(id, this.postDbi, this.commentDbi);
    }
}
