import cors from 'cors';
import express from 'express';
import { chalk } from 'tools/chalk';
import { devInfo } from 'app/dev/dev-actions';
import { UserAPI } from 'app/database/dbi/user-api';
import { PostAPI } from 'app/database/dbi/post-actions';
import { CommentAPI } from 'app/database/dbi/comment/comment-api';
import { randomBytes } from 'crypto';
import { MongoClient } from 'database/mongo-client';
import { RouteRegister } from 'server/routing';
import { CommonActions } from 'app/database/common-actions';
import { prettyTimestamp } from 'tools/time';
import { DatabaseActions } from 'server/route-handling/route-infra';
import { DatabaseInterface } from 'app/database/dbi/database-interface';
import { routes as apiRoutes } from 'server/router/api-router';
import { executeRouteHandler } from 'server/route-handling/route-handler';
import { Server as NodeServer } from 'http';
import { routes as miscRoutes } from 'router/misc-router';
import { routes as authRoutes } from 'router/auth-router';
import { DbComment, DbPost, DbRatedPosts, DbUser } from 'app/database/data-types';

export class Server {

    app = express();
    server: NodeServer;
    mongo: MongoClient;
    routeRegister = new RouteRegister();

    private userDbi: DatabaseInterface<DbUser>;
    private postDbi: DatabaseInterface<DbPost>;
    private rateDbi: DatabaseInterface<DbRatedPosts>;
    private commentDbi: DatabaseInterface<DbComment>;

    private actions: DatabaseActions;
    private postApi: PostAPI;
    private userApi: UserAPI;
    private commonApi: CommonActions;
    private commentApi: CommentAPI;

    private requestFingerprintSize = 3;

    constructor(private verbose = true) { }

    async initialize(): Promise<void> {
        if (this.verbose) {
            chalk.cyan('Starting server');
        }

        let dbUri: string;
        switch (process.env.environment) {
            case 'DEV':
                dbUri = 'mongodb://localhost:27017';
                break;
            case 'PROD':
                dbUri = process.env.DB_URL;
                break;
            default:
                throw new Error(`process.env.environment key is ${process.env.environment}, please use "DEV" or "PROD"`);
        }

        if (!process.env.KEY || !/[a-f\d]{32}/.test(process.env.key)) {
            throw new Error(`Expected process.env.environment to be a string of 64 bits in hexadecimal. Received: ${process.env.key} of type ${typeof process.env.KEY}`);
        }

        this.mongo = new MongoClient(dbUri, 'spiffing', this.verbose);
        await this.mongo.initialize();

        this.userDbi = new DatabaseInterface<DbUser>(this.mongo.db.collection('users'));
        this.postDbi = new DatabaseInterface<DbPost>(this.mongo.db.collection('posts'));
        this.rateDbi = new DatabaseInterface<DbRatedPosts>(this.mongo.db.collection('rated'));

        this.commentApi = new CommentAPI(this.commentDbi);
        this.postApi = new PostAPI(this.postDbi, this.commentApi);
        this.userApi = new UserAPI(this.userDbi, this.postApi, this.rateDbi);
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
                if (info.stream) info.streamHandler(request, this.verbose, fingerprint);
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
