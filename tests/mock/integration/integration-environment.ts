import { Request } from 'express';
import { DbComment } from 'database/data-types/comment';
import { CommentAPI } from 'database/dbi/comment/comment-api';
import { MongoClient } from 'database/mongo-client';
import { randomBytes } from 'crypto';
import { IBaseResponse } from 'interface/response';
import { CommonActions } from 'database/common-actions';
import { DatabaseInterface } from 'database/dbi/database-interface';
import { BoundPost, PostAPI } from 'database/dbi/post-actions';
import { BoundUser, UserAPI } from 'database/dbi/user-api';
import { Collection, ObjectId } from 'mongodb';
import { DbPost, DbRatedPosts, DbUser } from 'database/data-types';
import { DatabaseActions, RouteHandler, RoutePayload } from 'route-handling/route-infra';

export class IntegrationEnvironment {
    mongo: MongoClient;
    common: CommonActions;
    request = {
        headers: {} as any,
        params: {} as any,
        query: {} as any,
        body: {} as any
    };
    actions: DatabaseActions;
    defaultPassword = 'password';
    comments: {
        db: Collection<DbComment>;
        interface: DatabaseInterface<DbComment>;
        api: CommentAPI;
    };
    posts: {
        db: Collection<DbPost>;
        interface: DatabaseInterface<DbPost>;
        api: PostAPI;
    };
    ratings: {
        db: Collection<DbRatedPosts>;
        interface: DatabaseInterface<DbRatedPosts>;
    };
    users: {
        db: Collection<DbUser>;
        interface: DatabaseInterface<DbUser>;
        api: UserAPI;
    };

    constructor(public suiteName: string) {
        process.env.KEY = randomBytes(32).toString('hex');
    }

    async initialize(): Promise<void> {
        this.mongo = new MongoClient('mongodb://localhost:27017', 'spiffingTest', false);
        await this.mongo.initialize();

        this.comments = {} as any;
        this.comments.db = this.mongo.db.collection(`${this.suiteName}Comments`);
        this.comments.interface = new DatabaseInterface(this.comments.db);
        this.comments.api = new CommentAPI(this.comments.interface);

        this.posts = {} as any;
        this.posts.db = this.mongo.db.collection(`${this.suiteName}Posts`);
        this.posts.interface = new DatabaseInterface(this.posts.db);
        this.posts.api = new PostAPI(this.posts.interface, this.comments.api);

        this.comments.api.postApi = this.posts.api;

        this.ratings = {} as any;
        this.ratings.db = this.mongo.db.collection(`${this.suiteName}Ratings`);
        this.ratings.interface = new DatabaseInterface(this.ratings.db);

        this.users = {} as any;
        this.users.db = this.mongo.db.collection(`${this.suiteName}Users`);
        this.users.interface = new DatabaseInterface(this.users.db);
        this.users.api = new UserAPI(this.users.interface, this.posts.api, this.ratings.interface);

        this.common = new CommonActions(this.users.api);

        this.actions = {
            common: this.common,
            post: this.posts.api,
            user: this.users.api,
            comment: this.comments.api
        };
    }

    async closeConnections(): Promise<void> {
        await this.mongo.db.dropDatabase();
        await this.mongo.client.close();
    }

    async generateUser(): Promise<BoundUser> {
        return await this.users.api.createUser(
            `test-user-${Math.round(Math.random() * 999) + 1}`,
            this.common.securePassword(this.defaultPassword)
        );
    }

    async generateUsers(length: number): Promise<BoundUser[]> {
        const users: BoundUser[] = [];
        for (let i = 0; i < length; i++) users.push(await this.generateUser());
        return users;
    }

    async generatePosts(amount: number, author: ObjectId): Promise<BoundPost[]> {
        const posts: DbPost[] = [];
        for (let i = 0; i < amount; i++) {
            const post: DbPost = {
                _id: undefined,
                author,
                comments: [],
                content: 'Post Content',
                dislikes: 0,
                likes: 0,
                title: 'Post Title'
            };
            delete post._id;
            posts.push(post);
        }
        const insert = await this.posts.db.insertMany(posts);
        for (const index in insert.insertedIds) posts[index]._id = insert.insertedIds[index];
        return posts.map(post => new BoundPost(this.posts.api, post));
    }

    async executeRouteHandler<T extends IBaseResponse = IBaseResponse>(handler: RouteHandler<T>): Promise<RoutePayload<T>> {
        return await handler(this.request as Request, this.actions);
    }

}
