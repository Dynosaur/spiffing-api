import { ObjectId } from 'mongodb';
import { DbPost, DbUser } from 'database/data-types';
import { MockEnvironment } from 'tests/mock/mock-env';

export function testUsername(): string {
    return `test-user-${Math.round(Math.random() * 999) + 1}`;
}

export class MockUser implements DbUser {

    static defaultPassword = 'test-password';

    _id: ObjectId;
    password: {
        hash: string;
        salt: string;
    };
    screenname: string;
    username: string;

    constructor(public env: MockEnvironment<any>, username?: string, password?: string, screenname?: string, id?: ObjectId) {
        this.username = username || testUsername();
        if (password) {
            this.password = env.actions.securePassword(password);
        } else {
            this.password = env.actions.securePassword(MockUser.defaultPassword);
        }
        this.screenname = screenname || this.username;
        this._id = id || new ObjectId();
    }

    generatePosts(amount = 1): DbPost[] {
        return this.env.generatePosts(amount, this.username);
    }

}
