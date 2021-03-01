import cors from 'cors';
import express from 'express';
import { chalk } from 'tools/chalk';
import { devInfo } from 'dev/dev-actions';
import { randomBytes } from 'crypto';
import { MongoClient } from 'database/mongo-client';
import { DbRatedPosts } from 'database/rate';
import { RouteRegister } from 'server/routing';
import { CommonActions } from 'database/common-actions';
import { prettyTimestamp } from 'tools/time';
import { DbPost, PostAPI } from 'database/post';
import { DbUser, UserAPI } from 'database/user';
import { DatabaseActions } from 'route-handling/route-infra';
import { DatabaseInterface } from 'database/database-interface';
import { routes as apiRoutes } from 'router/api-router';
import { executeRouteHandler } from 'route-handling/route-handler';
import { Server as NodeServer } from 'http';
import { routes as miscRoutes } from 'router/misc-router';
import { routes as authRoutes } from 'router/auth-router';
import { CommentAPI, DbComment } from 'database/comment';

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export class Server {
    app = express();
    server!: NodeServer;
    mongo!: MongoClient;
    routeRegister = new RouteRegister();

    userDbi!: DatabaseInterface<DbUser>;
    postDbi!: DatabaseInterface<DbPost>;
    rateDbi!: DatabaseInterface<DbRatedPosts>;
    commentDbi!: DatabaseInterface<DbComment>;

    actions!: DatabaseActions;
    postApi!: PostAPI;
    userApi!: UserAPI;
    commonApi!: CommonActions;
    commentApi!: CommentAPI;

    requestFingerprintSize = 3;

    constructor(private verbose = true) { }

    async initialize(): Promise<void> {
        if (this.verbose) {
            chalk.cyan('Starting server');
        }

        let dbUri: string;
        let dbName: string;
        switch (process.env.environment) {
            case 'DEV':
                dbUri = 'mongodb://localhost:27017';
                dbName = 'spiffing';
                break;
            case 'TEST':
                dbUri = 'mongodb://localhost:27017';
                dbName = 'spiffing_valid_testing';
                break;
            case 'PROD':
                dbUri = process.env.DB_URL!;
                dbName = 'spiffing';
                break;
            default:
                throw new Error(`process.env.environment key is ${process.env.environment}, please use "DEV", "PROD", or "TEST".`);
        }

        if (!process.env.KEY || !/[a-f\d]{32}/.test(process.env.KEY!)) {
            throw new Error(`Expected process.env.KEY to be a string of 64 bits in hexadecimal. Received: ${process.env.KEY} of type ${typeof process.env.KEY}`);
        }

        this.mongo = new MongoClient(dbUri, dbName, this.verbose);
        await this.mongo.initialize();

        this.userDbi = new DatabaseInterface<DbUser>(this.mongo.getCollection('users'));
        this.postDbi = new DatabaseInterface<DbPost>(this.mongo.getCollection('posts'));
        this.rateDbi = new DatabaseInterface<DbRatedPosts>(this.mongo.getCollection('rated'));
        this.commentDbi = new DatabaseInterface<DbComment>(this.mongo.getCollection('comments'));

        this.commentApi = new CommentAPI(this.commentDbi, this.postDbi);
        this.postApi = new PostAPI(this.postDbi, this.commentDbi);
        this.userApi = new UserAPI(this.userDbi, this.postDbi, this.rateDbi, this.commentDbi);
        this.commonApi = new CommonActions(this.userApi);
        this.actions = {
            comment: this.commentApi,
            common: this.commonApi,
            post: this.postApi,
            user: this.userApi
        };
        this.configureExpress();
    }

    private configureExpress(): void {
        this.app.use(express.json());
        this.app.use(cors({ origin: '*' }));
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use((request, response) => {
            const fingerprint = randomBytes(this.requestFingerprintSize).toString('hex');
            if (this.verbose) chalk.yellow(`${fingerprint} ${prettyTimestamp()} ${request.method} ${request.url}`);
            const info = this.routeRegister.isRegistered(request);
            if (info) {
                if (info.streamHandler) info.streamHandler(request, this.verbose, fingerprint);
                else executeRouteHandler(request, this.actions, info.handler, fingerprint, this.verbose);
            } else {
                response.status(404).json({ message: 'Path not supported.' });
                if (this.verbose) chalk.yellow(`${fingerprint} Path is not supported.\n`);
            }
        });

        apiRoutes.forEach(info => this.routeRegister.register(info.path, info.method, info));
        authRoutes.forEach(info => this.routeRegister.register(info.path, info.method, info));
        devInfo.forEach(info => this.routeRegister.register(info.path, info.method, info));
        miscRoutes.forEach(info => this.routeRegister.register(info.path, info.method, info));
    }

    async start(port: number): Promise<void> {
        await this.initialize();
        this.server = this.app.listen(port, () => chalk.yellow(`Listening on port ${port}\n`));
    }
}
