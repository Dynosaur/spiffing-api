import { Post } from 'server/interface/data-types';
import { DbPost } from '../data-types';
import { ObjectId } from 'mongodb';
import { DatabaseInterface } from './database-interface';
import { BoundComment, CommentAPI } from './comment-actions';

export class BoundPost implements DbPost {

    _id: ObjectId;
    author: ObjectId;
    comments: ObjectId[];
    content: string;
    dislikes: number;
    likes: 0;
    title: string;

    id: string;
    date: number;

    constructor(private postApi: PostAPI, private commentApi: CommentAPI, obj: DbPost) {
        Object.assign(this, obj);
        this.id = this._id.toHexString();
        this.date = this._id.generationTime;
    }

    toInterface(): Post {
        return {
            _id: this.id,
            author: this.author.toHexString(),
            comments: this.comments.map(id => id.toHexString()),
            content: this.content,
            date: this.date,
            dislikes: this.dislikes,
            likes: this.likes,
            title: this.title
        };
    }

    async deletePost(): Promise<void> {
        this.postApi.deletePosts({ _id: this._id });
    }

    async addComment(author: string, content: string): Promise<BoundComment> {
        const comment = await this.commentApi.createComment(author, content);
        this.comments.push(comment._id);
        return comment;
    }
}

export class PostAPI {

    constructor(private dbi: DatabaseInterface<DbPost>, private commentApi: CommentAPI) { }

    async createPost(author: ObjectId, title: string, content: string): Promise<BoundPost> {
        const post: DbPost = {
            _id: new ObjectId(),
            author,
            comments: [],
            content,
            dislikes: 0,
            likes: 0,
            title
        };
        await this.dbi.create(post);
        return new BoundPost(this, this.commentApi, post);
    }

    async readPost(id: string): Promise<BoundPost> {
        const posts = await this.dbi.read({ _id: new ObjectId(id) });
        return posts.length ? new BoundPost(this, this.commentApi, posts[0]) : null;
    }

    async readPosts(query: Partial<DbPost>): Promise<BoundPost[]> {
        if (query._id && typeof query._id === 'string') query._id = new ObjectId(query._id);
        if (query.author && typeof query.author === 'string') query.author = new ObjectId(query.author);
        const posts = await this.dbi.read(query);
        return posts.map(post => new BoundPost(this, this.commentApi, post));
    }

    async updatePost(id: string, updates: Partial<DbPost>): Promise<void> {
        await this.dbi.update({ _id: new ObjectId(id) }, updates);
    }

    async deletePosts(query: Partial<DbPost>): Promise<void> {
        await this.dbi.delete(query);
    }

}
