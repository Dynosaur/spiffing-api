import * as express from 'express';
import * as cors from 'cors';
import { Request } from 'express';
import { DatabaseActions, MongoClient } from '../database';
import { DeveloperActions } from '../dev/dev-actions';
import { chalk, prettyTimestamp } from '../tools';
import { executeRouteHandler, ExportedRoutes, RouteHandlerFunctions } from './route-handling/route-handler';
import { apiRoutes, authRoutes } from './router';

function announceRequest(request: Request, response, next): void {
    chalk.yellow(prettyTimestamp() + ' ' + request.method + ' ' + request.url);
    // if (request.headers.authorization) {
    //     chalk.magenta('Authorization: ' + request.headers.authorization);
    // }
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

        this.mongoClient = new MongoClient('spiffing');
        await this.mongoClient.initialize();

        this.dbActions = new DatabaseActions(this.mongoClient.db.collection('users'), this.mongoClient.db.collection('posts'));
        this.routeChecks = new RouteHandlerFunctions(this.dbActions);
        this.configureExpress();
    }

    private attachRoutes(routes: () => ExportedRoutes): void {
        routes().forEach(route => {
            switch (route.method) {
                case 'GET':
                    this.express.get(route.path, request => executeRouteHandler(request, this.dbActions, this.routeChecks, route.handler));
                    break;
                case 'POST':
                    this.express.post(route.path, request => executeRouteHandler(request, this.dbActions, this.routeChecks, route.handler));
                    break;
                case 'DELETE':
                    this.express.delete(route.path, request => executeRouteHandler(request, this.dbActions, this.routeChecks, route.handler));
                    break;
                case 'PATCH':
                    this.express.patch(route.path, request => executeRouteHandler(request, this.dbActions, this.routeChecks, route.handler));
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

        this.express.get('/dev/data-types', (req, res) => this.devActions.streamDataTypes().pipe(res));
        this.express.get('/dev/endpoints', (req, res) => this.devActions.streamEndpoints().pipe(res));
        this.express.get('/dev/response', (req, res) => this.devActions.streamResponse().pipe(res));
    }

    public start(port: number): void {
        this.initialize().then(() => {
            this.express.listen(port, () => chalk.yellow(`Listening on port ${port}\n`));
        });
    }
}