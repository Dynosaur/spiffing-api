import { Collection } from 'mongodb';
import { resolve }    from 'path';
import {
    accessSync,
    constants,
    mkdirSync,
    readdirSync,
    unlinkSync,
    writeFileSync
} from 'fs';
import { DbComment }         from 'database/comment';
import { DatabaseInterface } from 'database/database-interface';
import { MongoClient }       from 'database/mongo-client';
import { DbPost }            from 'database/post';
import { DbRatedPosts }      from 'database/rate';
import { DbUser }            from 'database/user';

export class DatabaseEnvironment {
    private initialized = false;
    private mongo!: MongoClient;

    collection!: {
        comments: Collection<DbComment>;
        posts: Collection<DbPost>;
        rates: Collection<DbRatedPosts>;
        users: Collection<DbUser>;
    };

    interface!: {
        comments: DatabaseInterface<DbComment>;
        posts: DatabaseInterface<DbPost>;
        rates: DatabaseInterface<DbRatedPosts>;
        users: DatabaseInterface<DbUser>;
    }

    constructor(private databaseName: string) {}

    async initialize(): Promise<void> {
        if (this.initialized) return;
        this.mongo = new MongoClient('mongodb://localhost:27017', `spiffing-test-${this.databaseName}`, false);
        await this.mongo.initialize();
        this.collection = {
            comments: this.mongo.getCollection('comments'),
            posts: this.mongo.getCollection('posts'),
            rates: this.mongo.getCollection('rates'),
            users: this.mongo.getCollection('users')
        };
        this.interface = {
            comments: new DatabaseInterface(this.collection.comments),
            posts: new DatabaseInterface(this.collection.posts),
            rates: new DatabaseInterface(this.collection.rates),
            users: new DatabaseInterface(this.collection.users)
        };
        this.initialized = true;
    }

    async destroy(write = false, name?: string): Promise<void> {
        if (write) {
            const dirName = `testdb/${this.databaseName}`;
            try {
                accessSync(dirName, constants.F_OK);
            } catch (e) {
                mkdirSync(dirName, { recursive: true });
            }
            readdirSync(dirName).forEach(file => unlinkSync(resolve(dirName, file)));
            writeFileSync(
                `${dirName}/info.txt`,
                `TEST_NAME: "${name}"\nTIME: ${new Date().toString()}`
            );
            writeFileSync(
                `${dirName}/comments.json`,
                JSON.stringify(await this.interface.comments.getMany({}), null, 4)
            );
            writeFileSync(
                `testdb/${this.databaseName}/posts.json`,
                JSON.stringify(await this.interface.posts.getMany({}), null, 4)
            );
            writeFileSync(
                `testdb/${this.databaseName}/rates.json`,
                JSON.stringify(await this.interface.rates.getMany({}), null, 4)
            );
            writeFileSync(
                `testdb/${this.databaseName}/users.json`,
                JSON.stringify(await this.interface.users.getMany({}), null, 4)
            );
        }
        await this.mongo.close();
    }
}
