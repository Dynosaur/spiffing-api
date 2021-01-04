import { Post } from 'server/interface/data-types';
import { DbPost } from '../data-types';
import { ObjectId } from 'mongodb';
import { SwitchMap } from 'tools/switch-map';
import { CommentAPI } from './comment-actions';
import { DatabaseInterface } from './database-interface';

export class BoundPost {
    id: string;
    date: number;
    alive = true;
    author: string;
    private changed = new SwitchMap<string>();

    constructor(private postApi: PostAPI, private dbPost: DbPost) {
        this.id = this.dbPost._id.toHexString();
        this.date = this.dbPost._id.generationTime;
        this.author = this.dbPost.author.toHexString();
    }

    toInterface(): Post {
        return {
            _id: this.id,
            author: this.author,
            comments: this.dbPost.comments.map(id => id.toHexString()),
            content: this.dbPost.content,
            date: this.date,
            dislikes: this.dbPost.dislikes,
            likes: this.dbPost.likes,
            title: this.dbPost.title
        };
    }

    getId(): ObjectId {
        return this.dbPost._id;
    }

    getLikes(): number {
        return this.dbPost.likes;
    }
    setLikes(likes: number): void {
        this.dbPost.likes = likes;
        this.changed.on('likes');
    }

    getDislikes(): number {
        return this.dbPost.dislikes;
    }
    setDislikes(dislikes: number): void {
        this.dbPost.dislikes = dislikes;
        this.changed.on('dislikes');
    }

    async deletePost(): Promise<void> {
        await this.postApi.deletePosts({ _id: this.dbPost._id });
        this.alive = false;
    }

    async flush(): Promise<void> {
        if (this.alive === false)
            throw new Error(`Post ${this.id} has attempted changes but is no longer alive.`);
        const changed = {};
        for (const key of this.changed.keys())
            changed[key] = this.dbPost[key];
        await this.postApi.updatePost(this.id, changed);
        this.changed.clear();
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
        return new BoundPost(this, post);
    }

    async readPost(id: ObjectId | string): Promise<BoundPost> {
        let posts: DbPost[];
        if (id instanceof ObjectId)
            posts = await this.dbi.read({ _id: id });
        else
            posts = await this.dbi.read({ _id: new ObjectId(id) });
        return posts.length ? new BoundPost(this, posts[0]) : null;
    }

    async readPosts(query: Partial<DbPost>): Promise<BoundPost[]> {
        if (query._id && typeof query._id === 'string') query._id = new ObjectId(query._id);
        if (query.author && typeof query.author === 'string') query.author = new ObjectId(query.author);
        const posts = await this.dbi.read(query);
        return posts.map(post => new BoundPost(this, post));
    }

    async updatePost(id: string, updates: Partial<DbPost>): Promise<void> {
        await this.dbi.update({ _id: new ObjectId(id) }, updates);
    }

    async deletePosts(query: Partial<DbPost>): Promise<void> {
        await this.dbi.delete(query);
    }

}
