import { ObjectId } from 'mongodb';

export interface DbUser {
    _id: ObjectId;
    password: string;
    screenname: string;
    username: string;
}

export interface DbPost {
    _id: ObjectId;
    author: string;
    content: string;
    title: string;
}
