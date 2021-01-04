import { User } from 'app/server/interface/data-types';
import { PostAPI } from './post-actions';
import { RateAPI } from './rate-api';
import { ObjectId } from 'mongodb';
import { DatabaseInterface } from './database-interface';
import { DbRatedPosts, DbUser, Password } from '../data-types';

export class BoundUser implements DbUser {
    id: string;
    _id: ObjectId;
    password: Password;
    screenname: string;
    username: string;

    constructor(private userAPI: UserAPI, public rate: RateAPI, obj: DbUser) {
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

    async update(updates: Partial<DbUser>): Promise<void> {
        await this.userAPI.updateUser(this.id, updates);
    }

    async delete(): Promise<void> {
        this.userAPI.deleteUser(this._id);
    }

}

export class UserAPI {

    constructor(private dbi: DatabaseInterface<DbUser>, private postAPI: PostAPI, private rateDBI: DatabaseInterface<DbRatedPosts>) { }

    async createUser(username: string, password: Password): Promise<BoundUser> {
        const user: DbUser = {
            _id: new ObjectId(),
            password,
            screenname: username,
            username
        };
        await this.dbi.create(user);
        await this.rateDBI.create({
            _id: new ObjectId(),
            owner: user._id,
            posts: []
        });
        const rateAPI = new RateAPI(this.rateDBI, user._id);
        await rateAPI.initialize();
        return new BoundUser(this, rateAPI, user);
    }

    async readUser(query: Partial<DbUser>): Promise<BoundUser> {
        const users = await this.dbi.read(query);
        if (users.length) {
            const rateAPI = new RateAPI(this.rateDBI, users[0]._id);
            await rateAPI.initialize();
            return new BoundUser(this, rateAPI, users[0]);
        } else return null;
    }

    async updateUser(id: string, updates: Partial<DbUser>): Promise<void> {
        await this.dbi.update({ _id: new ObjectId(id) }, updates);
    }

    async deleteUser(id: ObjectId): Promise<void> {
        await this.dbi.delete({ _id: id });
        await this.rateDBI.delete({ owner: id });
        await this.postAPI.deletePosts({ author: id });
    }

}
