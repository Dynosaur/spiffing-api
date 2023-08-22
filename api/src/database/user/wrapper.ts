import { User } from 'interface/data-types';
import { ObjectId } from 'mongodb';
import { DbUser, Password } from 'database/user';

export class UserWrapper implements DbUser {
    _id!: ObjectId;
    username!: string;
    password!: Password;
    screenname!: string;

    id: string;
    created: number;

    constructor(user: DbUser) {
        Object.assign(this, user);
        this.id = this._id.toHexString();
        this.created = this._id.generationTime;
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
