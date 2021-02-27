import { FilterQuery, ObjectId, UpdateQuery } from 'mongodb';
import { DbPost, DbRatedPosts } from 'database/data-types';
import { DbUser, Password } from 'database/user/user';
import { DatabaseInterface } from 'database/dbi/database-interface';
import { UserWrapper } from 'database/user/wrapper';
import { RateAPI } from '../dbi/rate-api';
import { DbComment } from '../comment/comment';
import { deleteComment } from '../comment/api';

export class UserAPI {

    constructor(private user: DatabaseInterface<DbUser>,
                private posts: DatabaseInterface<DbPost>,
                private rates: DatabaseInterface<DbRatedPosts>,
                private comments: DatabaseInterface<DbComment>) { }

    async create(username: string, password: Password): Promise<UserWrapper> {
        const user = await this.user.create({
            username, password,
            screenname: username
        });
        await this.rates.create({
            owner: user._id,
            posts: []
        });
        return new UserWrapper(user);
    }

    async getById(id: ObjectId | string): Promise<UserWrapper | null> {
        const user = await this.user.get({ _id: typeof id === 'string' ? new ObjectId(id) : id });
        return user === null ? null : new UserWrapper(user);
    }

    async getByUsername(username: string): Promise<UserWrapper | null> {
        const user = await this.user.get({ username });
        return user === null ? null : new UserWrapper(user);
    }

    async getUserRateApi(id: ObjectId | string): Promise<RateAPI> {
        const userObjectId = typeof id === 'string' ? new ObjectId(id) : id;
        const api = new RateAPI(this.rates, userObjectId);
        await api.initialize();
        return api;
    }

    async getByQuery(query: FilterQuery<DbUser>): Promise<UserWrapper[]> {
        const users = await this.user.getMany(query);
        return users.map(dbUser => new UserWrapper(dbUser));
    }

    async getManyById(ids: ObjectId[]): Promise<UserWrapper[]> {
        const users = await this.user.getMany({ _id: { $in: ids } });
        return users.map(dbUser => new UserWrapper(dbUser));
    }

    async updateSet(id: ObjectId | string, updates: Partial<DbUser>): Promise<void> {
        await this.user.updateOne({ _id: typeof id === 'string' ? new ObjectId(id) : id }, { $set: updates });
    }

    async delete(id: ObjectId): Promise<void> {
        const rateApi = await this.getUserRateApi(id);
        const ratedPosts = rateApi.getRatedPosts().posts;
        const likedPosts = ratedPosts.filter(post => post.rating === 1).map(rated => rated._id);
        const dislikedPosts = ratedPosts.filter(post => post.rating === -1).map(rated => rated._id);
        await this.posts.updateMany(
            { _id: { $in: likedPosts } },
            { $inc: { likes: -1 } }
        );
        await this.posts.updateMany(
            { _id: { $in: dislikedPosts } },
            { $inc: { dislikes: -1 }}
        );
        await this.user.delete({ _id: id });
        await this.rates.delete({ owner: id });
        await this.posts.delete({ author: id });
        const comments = await this.comments.getMany({ author: id });
        comments.forEach(async dbComment => await deleteComment(dbComment._id, this.comments, this.posts));
    }

}
