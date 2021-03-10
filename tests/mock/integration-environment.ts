import { randomBytes } from 'crypto';
import { Request }     from 'express';
import { ObjectId }    from 'mongodb';
import { CommentAPI, CommentWrapper } from 'database/comment';
import { CommonActions }              from 'database/common-actions';
import { PostAPI, PostWrapper }       from 'database/post';
import { UserAPI, UserWrapper }       from 'database/user';
import { IBaseResponse }              from 'interface/response';
import { DatabaseEnvironment }        from './database-environment';
import {
    DatabaseActions,
    RouteHandler,
    RoutePayload
} from 'route-handling/route-infra';

type RequestField = Record<string, string | number>;

export class IntegrationEnvironment {
    common: CommonActions = null!;
    request: {
        body: RequestField;
        headers: RequestField;
        params: RequestField;
        query: RequestField;
    } = { headers: {}, params: {}, query: {}, body: {} };
    actions: DatabaseActions = null!;
    defaultPassword = 'password';

    db!: DatabaseEnvironment;
    api!: {
        comment: CommentAPI;
        post: PostAPI;
        user: UserAPI;
    };

    constructor(public suiteName: string) {
        process.env.KEY = randomBytes(32).toString('hex');
    }

    async initialize(): Promise<void> {
        this.db = new DatabaseEnvironment(this.suiteName);
        await this.db.initialize();

        this.api = {
            comment: new CommentAPI(this.db.interface.comments, this.db.interface.posts),
            post: new PostAPI(this.db.interface.posts, this.db.interface.comments),
            user: new UserAPI(this.db.interface.users, this.db.interface.posts, this.db.interface.rates, this.db.interface.comments)
        };

        this.common = new CommonActions(this.api.user);

        this.actions = {
            common: this.common,
            post: this.api.post,
            user: this.api.user,
            comment: this.api.comment
        };
    }

    async destroy(): Promise<void> {
        await this.db.destroy();
    }

    generateUser(): Promise<UserWrapper> {
        return this.api.user.create(
            `test-user-${Math.round(Math.random() * 999) + 1}`,
            this.common.securePassword(this.defaultPassword)
        );
    }

    async generateUsers(length: number): Promise<UserWrapper[]> {
        const users: UserWrapper[] = [];
        for (let i = 0; i < length; i++) users.push(await this.generateUser());
        return users;
    }

    generatePost(author: ObjectId): Promise<PostWrapper> {
        return this.api.post.create(author, 'Title', 'Content');
    }

    async generatePosts(amount: number, author: ObjectId): Promise<PostWrapper[]> {
        const posts: PostWrapper[] = [];
        for (let i = 0; i < amount; i++)
            posts.push(await this.generatePost(author));
        return posts;
    }

    generateComment(author: ObjectId, parentType: 'comment' | 'post', parentId: ObjectId
    ): Promise<CommentWrapper> {
        return this.api.comment.create(author, 'Content', parentType, parentId);
    }

    async generateComments(amount: number, author: ObjectId, parentType: 'comment' | 'post',
        parentId: ObjectId
    ): Promise<CommentWrapper[]> {
        const comments: CommentWrapper[] = [];
        for (let i = 0; i < amount; i++)
            comments.push(await this.api.comment.create(author, 'Content', parentType, parentId));
        return comments;
    }

    async executeRouteHandler<T extends IBaseResponse = IBaseResponse>(handler: RouteHandler<T>
    ): Promise<RoutePayload<T>> {
        return await handler(this.request as Request, this.actions);
    }
}
