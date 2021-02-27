import { DbComment } from 'database/comment';
import { DatabaseInterface } from 'database/database-interface';
import { DbPost, PostWrapper } from 'database/post';
import { FilterQuery, ObjectId, UpdateQuery } from 'mongodb';

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

    async delete(id: ObjectId | string): Promise<void> {
        const objectId = typeof id === 'string' ? new ObjectId(id) : id;
        await this.postDbi.delete({ _id: objectId });
        await this.commentDbi.deleteMany({ parent: { _id: objectId, contentType: 'post' } });
    }

}
