import { ObjectId } from 'mongodb';
import { DbUser, Password } from 'database/user/user';
import { User } from 'app/server/interface/data-types';

export class UserWrapper implements DbUser {
    _id!: ObjectId;
    username!: string;
    password!: Password;
    screenname!: string;

    id: string;

    constructor(user: DbUser) {
        Object.assign(this, user);
        this.id = this._id.toHexString();
    }

    toInterface(): User {
        return {
            _id: this.id,
            username: this.username,
            screenname: this.screenname,
            created: this._id.generationTime
        };
    }
}
