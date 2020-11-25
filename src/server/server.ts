import cors from 'cors';
import express from 'express';
import { chalk } from 'tools/chalk';
import { Request } from 'express';
import { RouteInfo } from 'server/route-handling/route-infra';
import { MongoClient } from 'database/mongo-client';
import { prettyTimestamp } from 'tools/time';
import { DatabaseActions } from 'database/database-actions';
import { DeveloperActions } from 'app/dev/dev-actions';
import { routes as apiRoutes } from 'server/router/api-router';
import { routes as authRoutes } from 'server/router/auth-router';
import { executeRouteHandler, RouteHandlerFunctions } from 'server/route-handling/route-handler';

function announceRequest(request: Request, response, next): void {
    chalk.yellow(prettyTimestamp() + ' ' + request.method + ' ' + request.url);
    next();
}

export class Server {

    private express = express();
    private mongoClient: MongoClient;
    private dbActions: DatabaseActions;
    private routeChecks: RouteHandlerFunctions;
    private devActions = new DeveloperActions();

    private async initialize(): Promise<void> {
        chalk.cyan('Initializing server...');

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

        this.mongoClient = new MongoClient(dbUri, 'spiffing');
        await this.mongoClient.initialize();

        this.dbActions = new DatabaseActions(this.mongoClient.db.collection('users'), this.mongoClient.db.collection('posts'));
        this.routeChecks = new RouteHandlerFunctions(this.dbActions);
        this.configureExpress();
    }

    private attachRoutes(routes: RouteInfo[]): void {
        routes.forEach(route => {
            switch (route.method) {
                case 'GET':
                    this.express.get(route.path, request => executeRouteHandler(request, this.dbActions, this.routeChecks, route.handler, route.requirements));
                    break;
                case 'POST':
                    this.express.post(route.path, request => executeRouteHandler(request, this.dbActions, this.routeChecks, route.handler, route.requirements));
                    break;
                case 'DELETE':
                    this.express.delete(route.path, request => executeRouteHandler(request, this.dbActions, this.routeChecks, route.handler, route.requirements));
                    break;
                case 'PATCH':
                    this.express.patch(route.path, request => executeRouteHandler(request, this.dbActions, this.routeChecks, route.handler, route.requirements));
                    break;
                default:
                    throw new Error('Route uses unsupported method: ' + route.method);
            }
        });
    }

    private configureExpress(): void {
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.json());
        this.express.use(cors({ origin: '*' }));
        this.express.use(announceRequest);

        this.attachRoutes(apiRoutes);
        this.attachRoutes(authRoutes);

        this.express.get('/', req => req.res.json({ message: 'Hello! Please use the /api path' }));

        this.express.get('/dev/data-types', (req, res) => this.devActions.streamDataTypes().pipe(res));
        this.express.get('/dev/endpoints', (req, res) => this.devActions.streamEndpoints().pipe(res));
        this.express.get('/dev/response', (req, res) => this.devActions.streamResponse().pipe(res));

        this.express.get('/dev/responses/api', (req, res) => this.devActions.streamResponsesApi().pipe(res));
        this.express.get('/dev/responses/auth', (req, res) => this.devActions.streamResponsesAuth().pipe(res));
        this.express.get('/dev/responses/error', (req, res) => this.devActions.streamResponsesError().pipe(res));

        this.express.get('*', req => req.res.json({ message: 'Path not supported.' }));
    }

    public start(port: number): void {
        this.initialize().then(() => {
            this.express.listen(port, () => chalk.yellow(`Listening on port ${port}\n`));
        }).catch(e => { throw e; });
    }
}
