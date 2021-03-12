import cors                     from 'cors';
import { randomBytes }          from 'crypto';
import express                  from 'express';
import { Server as NodeServer } from 'http';
import { resolve }              from 'path';
import { CommentAPI, DbComment } from 'database/comment';
import { CommonActions }         from 'database/common-actions';
import { DatabaseInterface }     from 'database/database-interface';
import { MongoClient }           from 'database/mongo-client';
import { DbPost, PostAPI }       from 'database/post';
import { DbRates }               from 'database/rate';
import { DbUser, UserAPI }       from 'database/user';
import { devInfo }               from 'dev/dev-actions';
import { RouteRegister }         from 'server/routing';
import { chalk }                 from 'tools/chalk';
import { prettyTimestamp }       from 'tools/time';
import { routes as apiRoutes }   from 'router/api-router';
import { executeRouteHandler }   from 'route-handling/route-handler';
import { routes as miscRoutes }  from 'router/misc-router';
import { routes as authRoutes }  from 'router/auth-router';
import { routes }                from 'router/route-map';
import {
    DatabaseActions,
    isHandlerRoute
} from 'route-handling/route-infra';

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
                dbUri = 'mongodb://localhost:27017';
                dbName = 'spiffing';
                this.verbose = true;
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
                throw new Error(`process.env.environment key is ${process.env.environment},` +
                'please use "DEV", "PROD", or "TEST".');
        }

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

        apiRoutes.forEach(info => this.routeRegister.register(info.path, info.method, info));
        authRoutes.forEach(info => this.routeRegister.register(info.path, info.method, info));
        miscRoutes.forEach(info => this.routeRegister.register(info.path, info.method, info));
        routes.forEach(info => this.routeRegister.register(info.path, info.method, info));
        if (process.env.environment === 'DEV')
            devInfo.forEach(info => this.routeRegister.register(info.path, info.method, info));
    }

    async start(port: number): Promise<void> {
        await this.initialize();
        this.server = this.app.listen(port, () => chalk.yellow(`Listening on port ${port}\n`));
    }
}
