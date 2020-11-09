import { DbUser } from '../../../src/database/data-types';
import { ObjectId } from 'mongodb';

export function testUsername(): string {
    return `test-user-${Math.round(Math.random() * 999) + 1}`;
}

export class MockUser implements DbUser {

    static defaultPassword = 'test-password';

    _id: ObjectId;
    password: string;
    screenname: string;
    username: string;

    constructor(username?: string, password?: string, screenname?: string, id?: ObjectId) {
        this._id = id || new ObjectId();
        this.password = password || MockUser.defaultPassword;
        this.screenname = screenname || testUsername();
        this.username = username || this.screenname;
    }

}
