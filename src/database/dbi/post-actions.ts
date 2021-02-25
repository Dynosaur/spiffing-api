import { Post } from 'interface/data-types';
import { DbPost } from 'database/data-types';
import { ObjectId } from 'mongodb';
import { SwitchMap } from 'tools/switch-map';
import { CommentAPI } from 'database/dbi/comment/comment-api';
import { BoundComment } from 'database/dbi/comment/bound-comment';
import { DatabaseInterface } from 'database/dbi/database-interface';

export class BoundPost {
    private alive = true;
    private changed = new SwitchMap<keyof DbPost>();

    constructor(private postApi: PostAPI, public dbPost: DbPost) {
    }

    toInterface(): Post {
        return {
            _id: this.dbPost._id.toHexString(),
            author: this.dbPost.author.toHexString(),
            comments: this.dbPost.comments.map(id => id.toHexString()),
            content: this.dbPost.content,
            date: this.dbPost._id.generationTime,
            dislikes: this.dbPost.dislikes,
            likes: this.dbPost.likes,
            title: this.dbPost.title
        };
    }

    getObjectId(): ObjectId {
        return new ObjectId(this.dbPost._id);
    }

    getIdString(): string {
        return this.dbPost._id.toHexString();
    }

    getLikes(): number {
        return this.dbPost.likes;
    }

    setLikes(likes: number): void {
        if (this.dbPost.likes === likes) {
            if (this.changed.has('likes')) this.changed.delete('likes');
            else return;
        } else this.changed.on('likes');
        this.dbPost.likes = likes;
    }

    getDislikes(): number {
        return this.dbPost.dislikes;
    }

    setDislikes(dislikes: number): void {
        this.dbPost.dislikes = dislikes;
        this.changed.on('dislikes');
    }

    getTitle(): string {
        return this.dbPost.title;
    }

    addComment(comment: BoundComment): void {
        this.dbPost.comments.push(comment.getObjectId());
        this.changed.on('comments');
    }

    async deletePost(): Promise<void> {
        await this.postApi.deletePosts({ _id: this.dbPost._id });
        this.alive = false;
    }

    async flush(): Promise<void> {
        const id = this.getIdString();
        if (this.alive === false)
            throw new Error(`Post ${id} has attempted changes but is no longer alive.`);
        const changed = {};
        for (const key of this.changed.keys())
            changed[key] = this.dbPost[key];
        await this.postApi.updatePost(id, changed);
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
