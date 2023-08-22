import { FilterQuery, ObjectId } from 'mongodb';
import { DbComment, deleteComment }      from 'database/comment';
import { DatabaseInterface }             from 'database/database-interface';
import { DbPost, deletePost }            from 'database/post';
import { DbRates, RateAPI }              from 'database/rate';
import { DbUser, Password, UserWrapper } from 'database/user';

export class UserAPI {

    constructor(private user: DatabaseInterface<DbUser>,
                private posts: DatabaseInterface<DbPost>,
                private rates: DatabaseInterface<DbRates>,
                private comments: DatabaseInterface<DbComment>) {}

    async create(username: string, password: Password): Promise<UserWrapper> {
        const user = await this.user.create({
            username, password,
            screenname: username
        });
        await this.rates.create({
            owner: user._id,
            comments: {
                liked: [],
                disliked: []
            },
            posts: {
                liked: [],
                disliked: []
            }
        });
        return new UserWrapper(user);
    }

    async getByUsername(username: string): Promise<UserWrapper | null> {
        const user = await this.user.get({ username });
        return user === null ? null : new UserWrapper(user);
    }

    async getUserRateApi(id: ObjectId | string): Promise<RateAPI> {
        const userObjectId = typeof id === 'string' ? new ObjectId(id) : id;
        const api = new RateAPI(userObjectId, this.rates, this.posts, this.comments);
        await api.initialize();
        return api;
    }

    async getManyByQuery(query: FilterQuery<DbUser>): Promise<UserWrapper[]> {
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
        const rated = rateApi.getRates();
        if (rated.posts.liked.length)
            await this.posts.updateMany(
                { _id: { $in: rated.posts.liked } },
                { $inc: { likes: -1 } }
            );
        if (rated.posts.disliked.length)
            await this.posts.updateMany(
                { _id: { $in: rated.posts.disliked } },
                { $inc: { dislikes: -1 }}
            );
        if (rated.comments.liked.length)
            await this.comments.updateMany(
                { _id: { $in: rated.comments.liked } },
                { $inc: { likes: -1 } }
            );
        if (rated.comments.disliked.length)
            await this.comments.updateMany(
                { _id: { $in: rated.comments.disliked } },
                { $inc: { dislikes: -1 }}
            );
        await this.user.delete({ _id: id });
        await this.rates.delete({ owner: id });
        const comments = await this.comments.getMany({ author: id });
        for (const dbComment of comments)
            await deleteComment(dbComment._id, this.comments, this.posts);
        const posts = await this.posts.getMany({ author: id });
        for (const post of posts)
            await deletePost(post._id, this.posts, this.comments, this.rates);
    }
}
