import { ObjectId } from 'mongodb';
import { BoundPost } from './post-actions';
import { DbRatedPosts } from '../data-types';
import { DatabaseInterface } from './database-interface';

export class RateAPI {
    private userRatedPosts: DbRatedPosts;

    constructor(private dbi: DatabaseInterface<DbRatedPosts>, private uid: ObjectId) { }

    async initialize(): Promise<void> {
        const result = await this.dbi.read({ owner: this.uid });
        if (result.length === 0) {
            this.userRatedPosts = {
                _id: new ObjectId(),
                owner: this.uid,
                posts: []
            };
            await this.dbi.create(this.userRatedPosts);
        } else this.userRatedPosts = result[0];
    }

    async likePost(post: BoundPost): Promise<boolean> {
        const ratedPost = this.userRatedPosts.posts.find(p => p._id.toHexString() === post.id);
        if (ratedPost) {
            if (ratedPost.rating === -1) {
                post.setDislikes(post.getDislikes() - 1);
                post.setLikes(post.getLikes() + 1);
                ratedPost.rating = 1;
                await post.flush();
                await this.dbi.update({ owner: this.uid }, { posts: this.userRatedPosts.posts });
                return true;
            } else return false;
        } else {
            this.userRatedPosts.posts.push({
                _id: post.getId(),
                rating: 1
            });
            await this.dbi.update({ owner: this.uid }, { posts: this.userRatedPosts.posts });
            post.setLikes(post.getLikes() + 1);
            await post.flush();
            return true;
        }
    }

    async dislikePost(post: BoundPost): Promise<boolean> {
        const ratedPost = this.userRatedPosts.posts.find(p => p._id.toHexString() === post.id);
        if (ratedPost) {
            if (ratedPost.rating === 1) {
                post.setLikes(post.getLikes() - 1);
                post.setDislikes(post.getDislikes() + 1);
                ratedPost.rating = -1;
                await post.flush();
                await this.dbi.update({ owner: this.uid }, { posts: this.userRatedPosts.posts });
                return true;
            } else return false;
        } else {
            this.userRatedPosts.posts.push({
                _id: post.getId(),
                rating: -1
            });
            await this.dbi.update({ owner: this.uid }, { posts: this.userRatedPosts.posts });
            post.setDislikes(post.getDislikes() + 1);
            await post.flush();
            return true;
        }
    }

    async unratePost(post: BoundPost): Promise<boolean> {
        const ratedPost = this.userRatedPosts.posts.find(p => p._id.toHexString() === post.id);
        if (ratedPost) {
            if (ratedPost.rating === -1)
                post.setDislikes(post.getDislikes() - 1);
            else
                post.setLikes(post.getLikes() - 1);
            await post.flush();
            this.userRatedPosts.posts.splice(this.userRatedPosts.posts.indexOf(ratedPost), 1);
            await this.dbi.update({ owner: this.uid }, { posts: this.userRatedPosts.posts });
            return true;
        } else return false;
    }

}
