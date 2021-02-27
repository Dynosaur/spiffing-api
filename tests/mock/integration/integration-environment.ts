import { Request } from 'express';
import { DbComment } from 'database/comment/comment';
import { CommentAPI } from 'database/comment/api';
import { MongoClient } from 'database/mongo-client';
import { randomBytes } from 'crypto';
import { IBaseResponse } from 'interface/response';
import { CommonActions } from 'database/common-actions';
import { DatabaseInterface } from 'app/database/database-interface';
import { PostAPI } from 'app/database/post/api';
import { UserAPI } from 'app/database/user/api';
import { Collection, ObjectId } from 'mongodb';
import { DbRatedPosts } from 'database/rate';
import { DatabaseActions, RouteHandler, RoutePayload } from 'route-handling/route-infra';
import { DbUser } from 'database/user/user';
import { UserWrapper } from 'database/user/wrapper';
import { DbPost, PostWrapper } from 'database/post';

export class IntegrationEnvironment {
    mongo: MongoClient = null as any;
    common: CommonActions = null as any;
    request = {
        headers: {} as any,
        params: {} as any,
        query: {} as any,
        body: {} as any
    };
    actions: DatabaseActions = null as any;
    defaultPassword = 'password';
    comments: {
        db: Collection<DbComment>;
        dbi: DatabaseInterface<DbComment>;
        api: CommentAPI;
    } = null as any;
    posts: {
        db: Collection<DbPost>;
        dbi: DatabaseInterface<DbPost>;
        api: PostAPI;
    } = null as any;
    ratings: {
        db: Collection<DbRatedPosts>;
        dbi: DatabaseInterface<DbRatedPosts>;
    } = null as any;
    users: {
        db: Collection<DbUser>;
        dbi: DatabaseInterface<DbUser>;
        api: UserAPI;
    } = null as any;

    constructor(public suiteName: string) {
        process.env.KEY = randomBytes(32).toString('hex');
    }

    async initialize(): Promise<void> {
        this.mongo = new MongoClient('mongodb://localhost:27017', 'spiffingTest', false);
        await this.mongo.initialize();

        this.comments = {} as any;
        this.comments.db = this.mongo.db.collection(`${this.suiteName}Comments`);
        this.comments.dbi = new DatabaseInterface(this.comments.db);

        this.posts = {} as any;
        this.posts.db = this.mongo.db.collection(`${this.suiteName}Posts`);
        this.posts.dbi = new DatabaseInterface(this.posts.db);

        this.comments.api = new CommentAPI(this.comments.dbi, this.posts.dbi);

        this.posts.api = new PostAPI(this.posts.dbi, this.comments.dbi);


        this.ratings = {} as any;
        this.ratings.db = this.mongo.db.collection(`${this.suiteName}Ratings`);
        this.ratings.dbi = new DatabaseInterface(this.ratings.db);

        this.users = {} as any;
        this.users.db = this.mongo.db.collection(`${this.suiteName}Users`);
        this.users.dbi = new DatabaseInterface(this.users.db);
        this.users.api = new UserAPI(this.users.dbi, this.posts.dbi, this.ratings.dbi, this.comments.dbi);

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

    generateUser(): Promise<UserWrapper> {
        return this.users.api.create(
            `test-user-${Math.round(Math.random() * 999) + 1}`,
            this.common.securePassword(this.defaultPassword)
        );
    }

    async generateUsers(length: number): Promise<UserWrapper[]> {
        const users: UserWrapper[] = [];
        for (let i = 0; i < length; i++) users.push(await this.generateUser());
        return users;
    }

    async generatePosts(amount: number, author: ObjectId): Promise<PostWrapper[]> {
        const posts: DbPost[] = [];
        for (let i = 0; i < amount; i++) {
            const post: DbPost = {
                _id: undefined as any,
                author,
                comments: [],
                content: 'Post Content',
                dislikes: 0,
                likes: 0,
                title: 'Post Title'
            };
            delete (post as any)._id;
            posts.push(post);
        }
        const insert = await this.posts.db.insertMany(posts);
        for (const index in insert.insertedIds) posts[index]._id = insert.insertedIds[index];
        return posts.map(post => new PostWrapper(post));
    }

    async executeRouteHandler<T extends IBaseResponse = IBaseResponse>(handler: RouteHandler<T>): Promise<RoutePayload<T>> {
        return await handler(this.request as Request, this.actions);
    }

}
