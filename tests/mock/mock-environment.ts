import { Response } from 'interface/response';
import { randomBytes } from 'crypto';
import { DbPost, DbUser } from 'database/data-types';
import { DatabaseActions } from 'database/database-actions';
import { RouteHandler, RoutePayload } from 'server/route-handling/route-infra';
import { executeRouteHandler, RouteHandlerFunctions } from 'server/route-handling/route-handler';
import { MockCollection, MockPost, MockRequest, MockUser } from 'tests/mock';

interface DatabaseConfig {
    userFill?: number;
    postFill?: number;
}

interface RequestConfig {
    body?: object;
    headers?: object;
    params?: object;
    query?: object;
}

export class MockEnvironment<RequestType> {

    actions: DatabaseActions;
    checks: RouteHandlerFunctions;
    posts: MockCollection<DbPost>;
    request: MockRequest<RequestType>;
    users: MockCollection<DbUser>;

    constructor(dbConfig: DatabaseConfig = {}, reqConfig: RequestConfig = {}) {
        process.env.KEY = randomBytes(32).toString('hex');

        this.users = new MockCollection();
        this.posts = new MockCollection();
        this.actions = new DatabaseActions(this.users as any, this.posts as any);
        this.checks = new RouteHandlerFunctions(this.actions);
        this.request = new MockRequest(reqConfig.params, reqConfig.query, reqConfig.headers, reqConfig.body);

        this.generateUsers(dbConfig.userFill);
        this.generatePosts(dbConfig.postFill);
    }

    createUser(username?: string, password?: string): MockUser {
        const user = new MockUser(this, username, password);
        this.users.data.push(user);
        return user;
    }

    generateUsers(amount: number): void {
        for (let i = 0; i < amount; i++) {
            this.createUser();
        }
    }

    createPost(author?: string): DbPost {
        const post = new MockPost(author);
        this.posts.data.push(post);
        return post;
    }

    generatePosts(amount: number, author?: string): DbPost[] {
        const posts: DbPost[] = [];
        for (let i = 0; i < amount; i++) {
            posts.push(this.createPost(author));
        }
        return posts;
    }

    async runRouteHandler<T extends Response = any>(handler: RouteHandler<T>, args?: object): Promise<RoutePayload<T>> {
        return await handler(this.request as any, this.actions, this.checks, args);
    }

    async integration<T extends Response = any>(handler: RouteHandler<T>, requirements?: object): Promise<void> {
        await executeRouteHandler(this.request as any, this.actions, this.checks, handler, requirements, false);
    }

}
