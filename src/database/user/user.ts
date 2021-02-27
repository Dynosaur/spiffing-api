import { ObjectId } from 'mongodb';

export interface Password {
    hash: string;
    salt: string;
}

export interface DbUser {
    _id: ObjectId;
    password: Password;
    screenname: string;
    username: string;
}
