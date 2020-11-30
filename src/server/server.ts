import cors from 'cors';
import { chalk } from 'tools/chalk';
import { Request } from 'express';
import { RouteInfo } from 'server/route-handling/route-infra';
import { MongoClient } from 'database/mongo-client';
import { prettyTimestamp } from 'tools/time';
import { DatabaseActions } from 'database/database-actions';
import { DeveloperActions } from 'app/dev/dev-actions';
import express, { Response } from 'express';
import { routes as apiRoutes } from 'server/router/api-router';
import { routes as authRoutes } from 'server/router/auth-router';
import { RouteRegister, UrlPath } from 'server/routing';
import { executeRouteHandler, RouteHandlerFunctions } from 'server/route-handling/route-handler';

export class Server {

    app = express();
    mongo: MongoClient;
    routeRegister = new RouteRegister();

    private dbActions: DatabaseActions;
    private routeChecks: RouteHandlerFunctions;
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

        this.dbActions = new DatabaseActions(
            this.mongo.db.collection('users'),
            this.mongo.db.collection('posts')
        );
        this.routeChecks = new RouteHandlerFunctions(this.dbActions);
        this.configureExpress();
    }

    private registerRoute(route: RouteInfo): void {
        this.routeRegister.register(route.path, route.method);
        this.app.use(async (request: Request, response: Response, next) => {
            if (request.method === route.method) {
                const path = new UrlPath(route.path);
                if (path.doesMatch(request.path)) {
                    request.params = path.extractParams(request.path) as any;
                    await executeRouteHandler(
                        request,
                        this.dbActions,
                        this.routeChecks,
                        route.handler,
                        route.requirements,
                        this.verbose
                    );
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
