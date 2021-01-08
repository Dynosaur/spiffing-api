import { PostAPI } from 'app/database/dbi/post-actions';
import { UserAPI } from 'app/database/dbi/user-api';
import { ObjectId } from 'mongodb';
import { CommentAPI } from 'app/database/dbi/comment-actions';
import { randomBytes } from 'crypto';
import { IBaseResponse } from 'app/server/interface/response';
import { CommonActions } from 'database/common-actions';
import { DatabaseInterface } from 'app/database/dbi/database-interface';
import { executeRouteHandler } from 'server/route-handling/route-handler';
import { MockCollection, MockRequest } from 'tests/mock';
import { DbComment, DbPost, DbRatedPosts, DbUser } from 'database/data-types';
import { DatabaseActions, RouteHandler, RoutePayload } from 'server/route-handling/route-infra';

process.env.KEY = randomBytes(32).toString('hex');

interface DatabaseConfig {
    userFill?: number;
    postFill?: number;
}

export class MockEnvironment<RequestType> {

    static defaultPassword = 'test-password';
    static defaultContent = 'It is possible to think of the initial and final conditions of the system as being a particle.';
    static defaultTitle = 'Copenhagen Interpretation of Quantum Versus Classical Kinematics';

    static generateUsername(): string {
        return `test-user-${Math.round(Math.random() * 999) + 1}`;
    }

    actions: DatabaseActions;
    request: MockRequest<RequestType>;

    comments = new MockCollection<DbComment>();
    commentDBI = new DatabaseInterface<DbComment>(this.comments as any);
    commentAPI = new CommentAPI(this.commentDBI);

    posts = new MockCollection<DbPost>();
    postDBI = new DatabaseInterface<DbPost>(this.posts as any);
    postAPI = new PostAPI(this.postDBI, this.commentAPI);

    ratings = new MockCollection<DbRatedPosts>();
    rateDBI = new DatabaseInterface<DbRatedPosts>(this.ratings as any);

    users = new MockCollection<DbUser>();
    userDBI = new DatabaseInterface<DbUser>(this.users as any);
    userAPI = new UserAPI(this.userDBI, this.postAPI, this.rateDBI);

    commonActions = new CommonActions(this.userAPI);

    constructor(dbConfig: DatabaseConfig = { }) {
        this.actions = {
            comment: this.commentAPI,
            common: this.commonActions,
            post: this.postAPI,
            user: this.userAPI
        };
        this.request = new MockRequest();

        this.generateUsers(dbConfig.userFill);
        this.generatePosts(dbConfig.postFill);
    }

    createUser(username = MockEnvironment.generateUsername(), password?: string): DbUser {
        const user: DbUser = {
            _id: new ObjectId(),
            password: this.commonActions.securePassword(password ? password : MockEnvironment.defaultPassword),
            screenname: username,
            username
        };
        this.users.data.push(user);
        return user;
    }

    generateUsers(amount: number): DbUser[] {
        const users: DbUser[] = [];
        for (let i = 0; i < amount; i++) {
            users.push(this.createUser());
        }
        return users;
    }

    createPost(author?: ObjectId): DbPost {
        const post: DbPost = {
            _id: new ObjectId(),
            author: author || new ObjectId(),
            comments: [],
            content: MockEnvironment.defaultContent,
            dislikes: 0,
            likes: 0,
            title: MockEnvironment.defaultTitle
        };
        this.posts.data.push(post);
        return post;
    }

    generatePosts(amount: number, author?: ObjectId): DbPost[] {
        const posts: DbPost[] = [];
        for (let i = 0; i < amount; i++) {
            posts.push(this.createPost(author));
        }
        return posts;
    }

    async runRouteHandler<T extends IBaseResponse = any>(handler: RouteHandler<T>): Promise<RoutePayload<T>> {
        return await handler(this.request as any, this.actions);
    }

    async integration<T extends IBaseResponse = any>(handler: RouteHandler<T>): Promise<void> {
        await executeRouteHandler(this.request as any, this.actions, handler, 'test', false);
    }

}
