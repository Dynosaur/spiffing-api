import cors from 'cors';
import { chalk } from 'tools/chalk';
import { Request } from 'express';
import { UserAPI } from 'app/database/dbi/user-api';
import { PostAPI } from 'app/database/dbi/post-actions';
import { CommentAPI } from 'app/database/dbi/comment-actions';
import { MongoClient } from 'database/mongo-client';
import { CommonActions } from 'app/database/common-actions';
import { prettyTimestamp } from 'tools/time';
import { DeveloperActions } from 'app/dev/dev-actions';
import express, { Response } from 'express';
import { DatabaseInterface } from 'app/database/dbi/database-interface';
import { routes as apiRoutes } from 'server/router/api-router';
import { executeRouteHandler } from 'server/route-handling/route-handler';
import { routes as authRoutes } from 'server/router/auth-router';
import { RouteRegister, UrlPath } from 'server/routing';
import { DbComment, DbPost, DbUser } from 'app/database/data-types';
import { DatabaseActions, RouteInfo } from 'server/route-handling/route-infra';

export class Server {

    app = express();
    mongo: MongoClient;
    routeRegister = new RouteRegister();

    private userDbi: DatabaseInterface<DbUser>;
    private postDbi: DatabaseInterface<DbPost>;
    private commentDbi: DatabaseInterface<DbComment>;

    private actions: DatabaseActions;
    private postApi: PostAPI;
    private userApi: UserAPI;
    private commonApi: CommonActions;
    private commentApi: CommentAPI;

    private devActions = new DeveloperActions();

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
                throw new Error('Unknown environment: ' + process.env.environment);
        }

        this.mongo = new MongoClient(dbUri, 'spiffing', this.verbose);
        await this.mongo.initialize();

        this.userDbi = new DatabaseInterface<DbUser>(this.mongo.db.collection('users'));
        this.postDbi = new DatabaseInterface<DbPost>(this.mongo.db.collection('posts'));

        this.userApi = new UserAPI(this.userDbi, this.postApi);
        this.commentApi = new CommentAPI(this.commentDbi);
        this.postApi = new PostAPI(this.postDbi, this.commentApi);
        this.commonApi = new CommonActions(this.userApi);
        this.actions = {
            comment: this.commentApi,
            common: this.commonApi,
            post: this.postApi,
            user: this.userApi
        };
        this.configureExpress();
    }

    private registerRoute(route: RouteInfo): void {
        this.routeRegister.register(route.path, route.method);
        this.app.use(async (request: Request, response: Response, next) => {
            if (request.method === route.method) {
                const path = new UrlPath(route.path);
                if (path.doesMatch(request.path)) {
                    request.params = path.extractParams(request.path) as any;
                    await executeRouteHandler(request, this.actions, route.handler, route.requirements, this.verbose);
                    return;
                }
            }
            next();
        });
    }

    private attachRoutes(routes: RouteInfo[]): void {
        routes.forEach(route => this.registerRoute(route));
    }

    private configureExpress(): void {
        this.app.use(express.json());
        this.app.use((request: Request, res, next) => {
            if (this.verbose) {
                chalk.yellow(prettyTimestamp() + ' ' + request.method + ' ' + request.url);
            }
            next();
        });
        this.app.use(cors({ origin: '*' }));
        this.app.use(express.urlencoded({ extended: true }));

        this.attachRoutes(apiRoutes);
        this.attachRoutes(authRoutes);

        this.app.get('/', req => req.res.json({ message: 'Hello! Please use the /api path' }));

        this.app.get('/dev/response', (req, res) => this.devActions.streamResponse().pipe(res));
        this.app.get('/dev/endpoints', (req, res) => this.devActions.streamEndpoints().pipe(res));
        this.app.get('/dev/data-types', (req, res) => this.devActions.streamDataTypes().pipe(res));
        this.app.get('/dev/responses/api', (req, res) => this.devActions.streamResponsesApi().pipe(res));
        this.app.get('/dev/responses/auth', (req, res) => this.devActions.streamResponsesAuth().pipe(res));
        this.app.get('/dev/responses/error', (req, res) => this.devActions.streamResponsesError().pipe(res));

        this.app.get('*', request => {
            chalk.rust(`No route handlers for ${request.path}.\n`);
            request.res.status(404).json({ message: 'Path not supported.' });
        });
    }

    start(port: number): void {
        this.initialize().then(() => {
            this.app.listen(port, () => chalk.yellow(`Listening on port ${port}\n`));
        }).catch(e => { throw e; });
    }
}
