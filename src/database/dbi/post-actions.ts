import { Post } from 'interface/data-types';
import { DbPost } from 'database/data-types';
import { ObjectId, UpdateQuery } from 'mongodb';
import { SwitchMap } from 'tools/switch-map';
import { CommentAPI } from 'database/comment/api';
import { CommentWrapper } from 'app/database/comment/wrapper';
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

    addComment(comment: CommentWrapper): void {
        this.dbPost.comments.push(comment._id);
        this.changed.on('comments');
    }

    deleteComment(comment: CommentWrapper): boolean {
        let index = -1;
        for (let i = 0; i < this.dbPost.comments.length; i++) {
            const commentId = this.dbPost.comments[i].toHexString();
            if (commentId === comment.id) {
                index = i;
                break;
            }
        }
        if (index === -1) return false;
        this.dbPost.comments.splice(index, 1);
        this.changed.on('comments');
        return true;
    }

    getComments(): ObjectId[] {
        return this.dbPost.comments.map(commentId => new ObjectId(commentId));
    }

    async deletePost(): Promise<void> {
        await this.postApi.deletePosts({ _id: this.dbPost._id });
        this.alive = false;
    }

    async flush(): Promise<void> {
        const id = this.getIdString();
        if (this.alive === false)
            throw new Error(`Post ${id} has attempted changes but is no longer alive.`);
        if (Array.from(this.changed.keys()).length === 0) return;
        const changed = {};
        for (const key of this.changed.keys())
            (changed as any)[key] = this.dbPost[key];
        await this.postApi.updatePost(id, { $set: { ...changed }});
        this.changed.clear();
    }

    async sync(): Promise<void> {
        const post = await this.postApi.readPost(this.getIdString());
        if (post === null) {
            this.alive = false;
            return;
        }
        this.dbPost = post.dbPost;
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

    async readPost(id: ObjectId | string): Promise<BoundPost | null> {
        let posts: DbPost[];
        if (id instanceof ObjectId)
            posts = await this.dbi.getMany({ _id: id });
        else
            posts = await this.dbi.getMany({ _id: new ObjectId(id) });
        return posts.length ? new BoundPost(this, posts[0]) : null;
    }

    async readPosts(query: Partial<DbPost>): Promise<BoundPost[]> {
        const posts = await this.dbi.getMany(query);
        return posts.map(post => new BoundPost(this, post));
    }

    async updatePost(id: string, updates: UpdateQuery<DbPost>): Promise<void> {
        await this.dbi.updateOne({ _id: new ObjectId(id) }, updates);
    }

    async deletePosts(query: Partial<DbPost>): Promise<void> {
        await this.dbi.delete(query);
    }

}
