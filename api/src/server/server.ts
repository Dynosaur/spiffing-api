import { CommentAPI, DbComment } from 'database/comment';
import { DatabaseActions, isHandlerRoute } from 'route-handling/route-infra';
import { DbPost, PostAPI } from 'database/post';
import { DbUser, UserAPI } from 'database/user';
import { CommonActions } from 'database/common-actions';
import { DatabaseInterface } from 'database/database-interface';
import { DbRates } from 'database/rate';
import { MongoClient } from 'database/mongo-client';
import { Server as NodeServer } from 'http';
import { RouteRegister } from 'server/routing';
import { chalk } from 'tools/chalk';
import cors from 'cors';
import { executeRouteHandler } from 'route-handling/route-handler';
import express from 'express';
import { route as interfaceRoute } from 'dev/seamstress/seamstress';
import { routes as miscRoutes } from 'router/misc-router';
import { prettyTimestamp } from 'tools/time';
import { randomBytes } from 'crypto';
import { resolve } from 'path';
import { routes } from 'router/route-map';

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export class Server {
    app = express();
    server!: NodeServer;
    mongo!: MongoClient;
    routeRegister = new RouteRegister();

    userDbi!: DatabaseInterface<DbUser>;
    postDbi!: DatabaseInterface<DbPost>;
    rateDbi!: DatabaseInterface<DbRates>;
    commentDbi!: DatabaseInterface<DbComment>;

    actions!: DatabaseActions;
    postApi!: PostAPI;
    userApi!: UserAPI;
    commonApi!: CommonActions;
    commentApi!: CommentAPI;

    requestFingerprintSize = 3;

    constructor(private verbose = false) {}

    async initialize(): Promise<void> {
        let dbUri: string;
        let dbName: string;
        switch (process.env.environment) {
            case 'DEV':
                dbUri = 'mongodb://127.0.0.1:27017';
                dbName = 'spiffing';
                this.verbose = true;
                break;
            case 'TEST':
                dbUri = 'mongodb://127.0.0.1:27017';
                dbName = 'spiffing_valid_testing';
                break;
            case 'PROD':
                dbUri = process.env.DB_URL!;
                dbName = 'spiffing';
                break;
            default:
                throw new Error(`process.env.environment key is ${process.env.environment},` +
                'please use "DEV", "PROD", or "TEST".');
        }

        if (this.verbose) console.log(`Process ID: ${process.pid}`); // eslint-disable-line no-console

        if (!process.env.KEY || !/[a-f\d]{32}/.test(process.env.KEY!))
            throw new Error('Expected process.env.KEY to be a string of 64 bits in hexadecimal.' +
            `Received: ${process.env.KEY} of type ${typeof process.env.KEY}`);

        this.mongo = new MongoClient(dbUri, dbName, this.verbose);
        await this.mongo.initialize();

        this.userDbi = new DatabaseInterface(this.mongo.getCollection('users'));
        this.postDbi = new DatabaseInterface(this.mongo.getCollection('posts'));
        this.rateDbi = new DatabaseInterface(this.mongo.getCollection('rated'));
        this.commentDbi = new DatabaseInterface(this.mongo.getCollection('comments'));

        this.commentApi = new CommentAPI(this.commentDbi, this.postDbi);
        this.postApi = new PostAPI(this.postDbi, this.commentDbi, this.rateDbi);
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
        this.app.use(express.static('spiffing'));
        this.app.use('/assets', express.static('spiffing/assets'));

        const apiRouter = express.Router();
        apiRouter.use((request, response) => {
            const fingerprint = randomBytes(this.requestFingerprintSize).toString('hex');
            if (this.verbose)
                chalk.yellow(`${fingerprint} ${prettyTimestamp()} ${request.method} ${request.url}`);
            const info = this.routeRegister.isRegistered(request);
            if (info) {
                if (isHandlerRoute(info))
                    executeRouteHandler(request, this.actions, info.handler, fingerprint, this.verbose);
                else info.streamHandler(request, this.verbose, fingerprint);
            } else {
                response.status(404).json({ message: 'Path not supported.' });
                if (this.verbose) chalk.yellow(`${fingerprint} Path is not supported.\n`);
            }
        });

        this.app.use('/api', apiRouter);
        this.app.use('', (req, res) => res.sendFile(resolve(__dirname, '../../spiffing/index.html')));

        routes.forEach(info => this.routeRegister.register(info.path, info.method, info));
        miscRoutes.forEach(info => this.routeRegister.register(info.path, info.method, info));
        if (process.env.environment === 'DEV')
            this.routeRegister.register(interfaceRoute.path, interfaceRoute.method, interfaceRoute);
    }

    async start(port: number): Promise<void> {
        await this.initialize();
        this.server = this.app.listen(port, () => chalk.yellow(`Listening on port ${port}\n`));
    }

    stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.close(error => {
                if (error) return reject(error);
                this.mongo.close().then(() => {
                    chalk.lime('bye');
                    resolve();
                });
            });
        });
    }
}
