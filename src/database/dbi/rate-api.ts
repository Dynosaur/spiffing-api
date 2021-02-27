import { ObjectId } from 'mongodb';
import { BoundPost } from './post-actions';
import { DbRatedPosts } from '../data-types';
import { DatabaseInterface } from './database-interface';

export class RateAPI {
    private userRatedPosts: DbRatedPosts = null as any;

    constructor(private dbi: DatabaseInterface<DbRatedPosts>, private uid: ObjectId) { }

    getRatedPosts(): DbRatedPosts {
        return {
            _id: new ObjectId(this.userRatedPosts._id),
            owner: new ObjectId(this.userRatedPosts.owner),
            posts: this.userRatedPosts.posts.map(post => {
                return {
                    _id: new ObjectId(post._id),
                    rating: post.rating,
                };
            })
        };
    }

    async initialize(): Promise<void> {
        const result = await this.dbi.getMany({ owner: this.uid });
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
        const ratedPost = this.userRatedPosts.posts.find(p => p._id.toHexString() === post.getIdString());
        if (ratedPost) {
            if (ratedPost.rating === -1) {
                post.setDislikes(post.getDislikes() - 1);
                post.setLikes(post.getLikes() + 1);
                ratedPost.rating = 1;
                await post.flush();
                await this.dbi.updateOne({ owner: this.uid }, { $set: { posts: this.userRatedPosts.posts } });
                return true;
            } else return false;
        } else {
            this.userRatedPosts.posts.push({
                _id: post.getObjectId(),
                rating: 1
            });
            await this.dbi.updateOne({ owner: this.uid }, { $set: { posts: this.userRatedPosts.posts } });
            post.setLikes(post.getLikes() + 1);
            await post.flush();
            return true;
        }
    }

    async dislikePost(post: BoundPost): Promise<boolean> {
        const ratedPost = this.userRatedPosts.posts.find(p => p._id.toHexString() === post.getIdString());
        if (ratedPost) {
            if (ratedPost.rating === 1) {
                post.setLikes(post.getLikes() - 1);
                post.setDislikes(post.getDislikes() + 1);
                ratedPost.rating = -1;
                await post.flush();
                await this.dbi.updateOne({ owner: this.uid }, { $set: { posts: this.userRatedPosts.posts } });
                return true;
            } else return false;
        } else {
            this.userRatedPosts.posts.push({
                _id: post.getObjectId(),
                rating: -1
            });
            await this.dbi.updateOne({ owner: this.uid }, { $set: { posts: this.userRatedPosts.posts } });
            post.setDislikes(post.getDislikes() + 1);
            await post.flush();
            return true;
        }
    }

    async unratePost(post: BoundPost): Promise<boolean> {
        const ratedPost = this.userRatedPosts.posts.find(p => p._id.toHexString() === post.getIdString());
        if (ratedPost) {
            if (ratedPost.rating === -1)
                post.setDislikes(post.getDislikes() - 1);
            else
                post.setLikes(post.getLikes() - 1);
            await post.flush();
            this.userRatedPosts.posts.splice(this.userRatedPosts.posts.indexOf(ratedPost), 1);
            await this.dbi.updateOne({ owner: this.uid }, { $set: { posts: this.userRatedPosts.posts } });
            return true;
        } else return false;
    }

}
