import { User } from 'interface/data-types';
import { PostAPI } from 'database/dbi/post-actions';
import { RateAPI } from 'database/dbi/rate-api';
import { ObjectId } from 'mongodb';
import { DatabaseInterface } from 'database/dbi/database-interface';
import { DbRatedPosts, DbUser, Password } from 'database/data-types';

export class BoundUser implements DbUser {
    id: string;
    _id: ObjectId;
    password: Password;
    screenname: string;
    username: string;

    constructor(private api: UserAPI, obj: DbUser) {
        Object.assign(this, obj);
        this.id = this._id.toHexString();
    }

    toInterface(): User {
        return {
            _id: this.id,
            created: this._id.generationTime,
            screenname: this.screenname,
            username: this.username
        };
    }

    async getRateApi(): Promise<RateAPI> {
        let rateApi = new RateAPI(this.api.rateDbi, this._id);
        await rateApi.initialize();
        return rateApi;
    }

    async update(updates: Partial<DbUser>): Promise<void> {
        await this.api.updateUser(this.id, updates);
    }

    async delete(): Promise<void> {
        await this.api.deleteUser(this._id);
    }

}

export class UserAPI {

    constructor(private dbi: DatabaseInterface<DbUser>, private postApi: PostAPI, public rateDbi: DatabaseInterface<DbRatedPosts>) { }

    async createUser(username: string, password: Password): Promise<BoundUser> {
        const user: DbUser = {
            _id: undefined,
            password,
            screenname: username,
            username
        };
        delete user._id;
        await this.dbi.create(user);
        const ratedPosts: DbRatedPosts = {
            _id: undefined,
            owner: user._id,
            posts: []
        };
        delete ratedPosts._id;
        await this.rateDbi.create(ratedPosts);
        return new BoundUser(this, user);
    }

    async readUser(query: Partial<DbUser>): Promise<BoundUser> {
        const users = await this.dbi.read(query);
        if (users.length) return new BoundUser(this, users[0]);
        else return null;
    }

    async getUsersById(ids: ObjectId[]): Promise<BoundUser[]> {
        const users = await this.dbi.read({ _id: { $in: ids } as any });
        const boundUsers: BoundUser[] = [];
        for (const user of users) boundUsers.push(new BoundUser(this, user));
        return boundUsers;
    }

    async updateUser(id: string, updates: Partial<DbUser>): Promise<void> {
        await this.dbi.update({ _id: new ObjectId(id) }, updates);
    }

    async deleteUser(id: ObjectId): Promise<void> {
        await this.dbi.delete({ _id: id });
        await this.rateDbi.delete({ owner: id });
        await this.postApi.deletePosts({ author: id });
    }

}
