import { DbPost } from 'database/post';
import { ObjectId } from 'mongodb';
import { RatedPosts } from 'interface/data-types';
import { DbRatedPosts } from 'database/rate';
import { DatabaseInterface } from 'database/database-interface';

export class RateAPI {
    private userRatedPosts!: DbRatedPosts;

    constructor(private userId: ObjectId, private rateDbi: DatabaseInterface<DbRatedPosts>, private postDbi: DatabaseInterface<DbPost>) {}

    async refreshUserRatedPosts(): Promise<void> {
        const rates = await this.rateDbi.get({ owner: this.userId });
        if (rates === null) this.userRatedPosts = await this.rateDbi.create({
            owner: this.userId,
            posts: []
        });
        else this.userRatedPosts = rates;
    }

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

    getInterfaceRatedPosts(): RatedPosts {
        return {
            _id: this.userRatedPosts._id.toHexString(),
            owner: this.userRatedPosts.owner.toHexString(),
            posts: this.userRatedPosts.posts.map(ratedPost => {
                return { _id: ratedPost._id.toHexString(), rating: ratedPost.rating };
            })
        };
    }

    initialize(): Promise<void> {
        return this.refreshUserRatedPosts();
    }

    async likePost(postId: ObjectId): Promise<boolean> {
        const ratedPost = this.userRatedPosts.posts.find(ratedPost =>
            ratedPost._id.toHexString() === postId.toHexString()
        );
        if (ratedPost === undefined) {
            await this.rateDbi.updateOne(
                { owner: this.userId },
                { $push: { posts: { _id: postId, rating: 1 } } }
            );
            await this.postDbi.updateOne(
                { _id: postId },
                { $inc: { likes: 1 } }
            );
            return true;
        }
        if (ratedPost.rating === -1) {
            await this.rateDbi.updateOne(
                { owner: this.userId, 'posts._id': postId },
                { $set: { 'posts.$.rating': 1 } }
            );
            await this.postDbi.updateOne({ _id: postId }, { $inc: { dislikes: -1, likes: 1 } });
            return true;
        } else return false;
    }

    async dislikePost(postId: ObjectId): Promise<boolean> {
        const ratedPost = this.userRatedPosts.posts.find(ratedPost =>
            ratedPost._id.toHexString() === postId.toHexString()
        );
        if (ratedPost === undefined) {
            await this.rateDbi.updateOne(
                { owner: this.userId },
                { $push: { posts: { _id: postId, rating: -1 } } }
            );
            await this.postDbi.updateOne(
                { _id: postId },
                { $inc: { dislikes: 1 } }
            );
            return true;
        } else {
            if (ratedPost.rating === 1) {
                await this.rateDbi.updateOne(
                    { owner: this.userId, 'posts._id': postId },
                    { $set: { 'posts.$.rating': -1 } }
                );
                await this.postDbi.updateOne(
                    { _id: postId },
                    { $inc: { dislikes: 1, likes: -1 } }
                );
                return true;
            } else return false;
        }
    }

    async unratePost(postId: ObjectId): Promise<boolean> {
        const ratedPost = this.userRatedPosts.posts.find(ratedPost =>
            ratedPost._id.toHexString() === postId.toHexString()
        );
        if (ratedPost === undefined) return false;
        else {
            if (ratedPost.rating === -1)
                await this.postDbi.updateOne(
                    { _id: postId },
                    { $inc: { dislikes: -1 } }
                );
            else
                await this.postDbi.updateOne(
                    { _id: postId },
                    { $inc: { likes: -1 } }
                );
            await this.rateDbi.updateOne(
                { owner: this.userId },
                { $pull: { posts: { _id: postId } } }
            );
            return true;
        }
    }

}
