import { User } from 'app/server/interface/data-types';
import { PostAPI } from './post-actions';
import { ObjectId } from 'mongodb';
import { DatabaseInterface } from './database-interface';
import { DbRatedPosts, DbUser, Password } from '../data-types';

export class BoundUser implements DbUser {

    _id: ObjectId;
    password: Password;
    screenname: string;
    username: string;

    id: string;

    constructor(private userAPI: UserAPI, obj: DbUser) {
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

    constructor(private dbi: DatabaseInterface<DbUser>, private postAPI: PostAPI, private rateDbi: DatabaseInterface<DbRatedPosts>) { }

    async createUser(username: string, password: Password): Promise<BoundUser> {
        const user: DbUser = {
            _id: new ObjectId(),
            password,
            screenname: username,
            username
        };
        await this.dbi.create(user);
        await this.rateDbi.create({
            _id: new ObjectId(),
            owner: user._id,
            posts: []
        });
        return new BoundUser(this, user);
    }

    async readUser(query: Partial<DbUser>): Promise<BoundUser> {
        const users = await this.dbi.read(query);
        return users.length ? new BoundUser(this, users[0]) : null;
    }

    async updateUser(id: string, updates: Partial<DbUser>): Promise<void> {
        await this.dbi.update({ _id: new ObjectId(id) }, updates);
    }

    async deleteUser(id: ObjectId): Promise<void> {
        await this.dbi.delete({ _id: id });
        await this.rateDbi.delete({ owner: id });
        await this.postAPI.deletePosts({ author: id });
    }

}
