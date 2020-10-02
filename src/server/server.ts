import * as express from 'express';
import { Request as ExpressRequest } from 'express';
import * as cors from 'cors';

import { chalk } from '../tools';
import { MongoClient, UserActions, PostActions } from '../database';
import { DeveloperActions } from '../dev/dev-actions';
import { Action } from './interface';
import { apiRoutes, authRoutes } from './router';

export type HttpMethod = 'GET' | 'POST';

export type Request<T extends Action> = ExpressRequest<T['params'], T['response'], T['body'], T['query']>;

export interface ResourceManager {
    post: PostActions;
    user: UserActions;
}

export interface RouteHandlerResponse<T extends Action> {
    httpCode: number;
    print: string;
    send: T['response'];
}

export type ExportedRoutes = Array<{
    method: HttpMethod;
    path: string;
    handler: RouteHandler;
}>;

export interface HandlerReply {
    httpCode: number;
    message: string;
    payload?: any;
}

export type RouteHandler = (request: ExpressRequest, rsrc: ResourceManager) => Promise<HandlerReply>;

async function executeRouteHandler(request: ExpressRequest, resources: ResourceManager, handler: RouteHandler): Promise<void> {
    chalk.yellow(request.method + ' ' + request.url);
    const reply = await handler(request, resources);
    request.res.status(reply.httpCode).send(reply.payload);

    const message = `[${reply.httpCode}] ${reply.message}`;
    if (reply.httpCode < 100 || reply.httpCode > 600) {
        console.log(message);
    } else if (reply.httpCode < 200) {
        chalk.yellow(reply.message);
    } else if (reply.httpCode < 300) {
        chalk.green(reply.message);
    } else {
        chalk.red(reply.message);
    }
}

const hostPort = require('../../server-config.json')['server-port'];

class Server {

    private express = express();
    private mongoClient: MongoClient;
    private userActions: UserActions;
    private postActions: PostActions;
    private devActions: DeveloperActions;
    private resourceManager: ResourceManager;

    private async initialize(): Promise<void> {
        chalk.cyan('Initializing server...');

        this.mongoClient = new MongoClient('spiffing');
        await this.mongoClient.initialize();

        this.userActions = new UserActions(this.mongoClient.db.collection('users'));
        this.postActions = new PostActions(this.mongoClient.db.collection('posts'));
        this.devActions = new DeveloperActions();
        this.resourceManager = { post: this.postActions, user: this.userActions };
        this.configureExpress();
    }

    private attachRoutes(routes: () => ExportedRoutes): void {
        routes().forEach(route => {
            switch (route.method) {
                case 'GET':
                    this.express.get(route.path, request => executeRouteHandler(request, this.resourceManager, route.handler));
                    break;
                case 'POST':
                    this.express.post(route.path, request => executeRouteHandler(request, this.resourceManager, route.handler));
                    break;
            }
        });
    }

    private configureExpress(): void {
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.json());
        this.express.use(cors({ origin: '*' }));

        this.attachRoutes(apiRoutes);
        this.attachRoutes(authRoutes);

        this.express.get('/dev/data-types', (req, res) => this.devActions.streamDataTypes().pipe(res));
        this.express.get('/dev/endpoints', (req, res) => this.devActions.streamEndpoints().pipe(res));
        this.express.get('/dev/response', (req, res) => this.devActions.streamResponse().pipe(res));
    }

    public start(port: number): void {
        this.initialize().then(() => {
            this.express.listen(port, () => chalk.yellow(`Listening on port ${port}`));
        });
    }
}

const server = new Server();
server.start(hostPort);
