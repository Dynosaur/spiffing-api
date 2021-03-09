import { ObjectId } from 'mongodb';
import { DatabaseInterface } from 'database/database-interface';
import { DbPost }            from 'database/post';
import { DbRates }           from 'database/rate';
import { RatedPosts }        from 'interface/data-types';

export class RateAPI {
    private userRates!: DbRates;
    private ratedCommentMap = new Map<string, 1 | -1>();
    private ratedPostMap = new Map<string, 1 | -1>();

    constructor(private userId: ObjectId, private rateDbi: DatabaseInterface<DbRates>, private postDbi: DatabaseInterface<DbPost>) {}

    async refreshUserRatedPosts(): Promise<void> {
        const rates = await this.rateDbi.get({ owner: this.userId });
        if (rates === null) this.userRates = await this.rateDbi.create({
            owner: this.userId,
            comments: {
                liked: [],
                disliked: []
            },
            posts: {
                liked: [],
                disliked: []
            }
        });
        else {
            this.userRates = rates;
            this.ratedCommentMap.clear();
            this.ratedPostMap.clear();
            this.userRates.comments.liked.forEach(id =>
                this.ratedCommentMap.set(id.toHexString(), 1)
            );
            this.userRates.comments.disliked.forEach(id =>
                this.ratedCommentMap.set(id.toHexString(), -1)
            );
            this.userRates.posts.liked.forEach(id =>
                this.ratedPostMap.set(id.toHexString(), 1)
            );
            this.userRates.posts.disliked.forEach(id =>
                this.ratedPostMap.set(id.toHexString(), -1)
            );
        }
    }

    getRatedPosts(): DbRates {
        return {
            _id: new ObjectId(this.userRates._id),
            owner: new ObjectId(this.userRates.owner),
            comments: {
                liked: this.userRates.comments.liked.map(id => new ObjectId(id)),
                disliked: this.userRates.comments.disliked.map(id => new ObjectId(id))
            },
            posts: {
                liked: this.userRates.posts.liked.map(id => new ObjectId(id)),
                disliked: this.userRates.posts.disliked.map(id => new ObjectId(id))
            }
        };
    }

    getInterfaceRatedPosts(): RatedPosts {
        return {
            _id: this.userRates._id.toHexString(),
            owner: this.userRates.owner.toHexString(),
            comments: {
                liked: this.userRates.comments.liked.map(id => id.toHexString()),
                disliked: this.userRates.comments.disliked.map(id => id.toHexString())
            },
            posts: {
                liked: this.userRates.posts.liked.map(id => id.toHexString()),
                disliked: this.userRates.posts.disliked.map(id => id.toHexString())
            }
        };
    }

    initialize(): Promise<void> {
        return this.refreshUserRatedPosts();
    }

    async likePost(postId: ObjectId): Promise<boolean> {
        if (!this.ratedPostMap.has(postId.toHexString())) {
            await this.rateDbi.updateOne(
                { owner: this.userId },
                { $push: { 'posts.liked': postId } }
            );
            await this.postDbi.updateOne(
                { _id: postId },
                { $inc: { likes: 1 } }
            );
            return true;
        }
        if (this.ratedPostMap.get(postId.toHexString()) === -1) {
            await this.rateDbi.updateOne(
                { owner: this.userId },
                {
                    $pull: { 'posts.disliked': postId },
                    $push: { 'posts.liked': postId }
                }
            );
            await this.postDbi.updateOne(
                { _id: postId },
                { $inc: { dislikes: -1, likes: 1 } }
            );
            return true;
        } else return false;
    }

    async dislikePost(postId: ObjectId): Promise<boolean> {
        if (!this.ratedPostMap.has(postId.toHexString())) {
            await this.rateDbi.updateOne(
                { owner: this.userId },
                { $push: { 'posts.disliked': postId } }
            );
            await this.postDbi.updateOne(
                { _id: postId },
                { $inc: { dislikes: 1 } }
            );
            return true;
        }
        if (this.ratedPostMap.get(postId.toHexString()) === 1) {
            await this.rateDbi.updateOne(
                { owner: this.userId },
                {
                    $pull: { 'posts.liked': postId },
                    $push: { 'posts.disliked': postId }
                }
            );
            await this.postDbi.updateOne(
                { _id: postId },
                { $inc: { dislikes: 1, likes: -1 } }
            );
            return true;
        } else return false;
    }

    async unratePost(postId: ObjectId): Promise<boolean> {
        if (!this.ratedPostMap.has(postId.toHexString())) return false;
        if (this.ratedPostMap.get(postId.toHexString()) === -1) {
            await this.postDbi.updateOne(
                { _id: postId },
                { $inc: { dislikes: -1 } }
            );
            await this.rateDbi.updateOne(
                { owner: this.userId },
                { $pull: { 'posts.disliked': postId } }
            );
        } else {
            await this.postDbi.updateOne(
                { _id: postId },
                { $inc: { likes: -1 } }
            );
            await this.rateDbi.updateOne(
                { owner: this.userId },
                { $pull: { 'posts.liked': postId } }
            );
        }
        return true;
    }

}
