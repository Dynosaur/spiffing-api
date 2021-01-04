import { ObjectId } from 'mongodb';
import { BoundPost } from './post-actions';
import { DbRatedPosts } from '../data-types';
import { DatabaseInterface } from './database-interface';

export class RateAPI {
    private userRatedPosts: DbRatedPosts;

    constructor(private dbi: DatabaseInterface<DbRatedPosts>, private uid: ObjectId) { }

    async initialize(): Promise<void> {
        this.userRatedPosts = await this.dbi.read({ owner: this.uid })[0];
    }

    async likePost(post: BoundPost): Promise<void> {
        const ratedPost = this.userRatedPosts.posts.find(p => p._id.toHexString() === post.id);
        if (ratedPost) {
            if (ratedPost.rating === -1) {
                post.setDislikes(post.getDislikes() - 1);
                post.setLikes(post.getLikes() + 1);
                ratedPost.rating = 1;
                await post.flush();
            }
        } else {
            this.userRatedPosts.posts.push({
                _id: post.getId(),
                rating: 1
            });
            await this.dbi.update({ owner: this.uid }, { posts: this.userRatedPosts.posts });
        }
    }

    async dislikePost(post: BoundPost): Promise<void> {
        const ratedPost = this.userRatedPosts.posts.find(p => p._id.toHexString() === post.id);
        if (ratedPost) {
            if (ratedPost.rating === 1) {
                post.setLikes(post.getLikes() - 1);
                post.setDislikes(post.getDislikes() + 1);
                ratedPost.rating = -1;
                await post.flush();
            }
        } else {
            this.userRatedPosts.posts.push({
                _id: post.getId(),
                rating: -1
            });
            await this.dbi.update({ owner: this.uid }, { posts: this.userRatedPosts.posts });
        }
    }

    async unratePost(post: BoundPost): Promise<void> {
        const ratedPost = this.userRatedPosts.posts.find(p => p._id.toHexString() === post.id);
        if (ratedPost) {
            if (ratedPost.rating === -1)
                post.setDislikes(post.getDislikes() - 1);
            else
                post.setLikes(post.getLikes() - 1);
            await post.flush();
            this.userRatedPosts.posts.splice(this.userRatedPosts.posts.indexOf(ratedPost), 1);
            await this.dbi.update({ owner: this.uid }, { posts: this.userRatedPosts.posts });
        }
    }

}
