import { CommentWrapper }             from 'database/comment';
import { PostWrapper }                from 'database/post';
import { UserWrapper }                from 'database/user';
import { Comment, Post, Rates, User } from 'interface/data-types';
import { ErrorResponse, OkResponse }  from './response';
import {
    ICreatePost,
    IDeleteComment,
    IGetComments,
    IGetPosts,
    IGetRates,
    IGetUsers,
    IPostComment,
    IRateComment,
    IRatePost
} from 'interface/responses/api-responses';

export namespace GetPosts {
    export class Success extends OkResponse<IGetPosts.Success> {
        constructor(public posts: Post[], public allowed: string[], public blocked: string[], public failed: any[]) {
            super(`Successfully found ${posts.length} posts.`);
            this.payload.posts = this.posts;
            if (this.allowed.length)
                this.payload['query-allowed'] = this.allowed;
            if (this.blocked.length)
                this.payload['query-blocked'] = this.blocked;
            if (Object.keys(this.failed).length)
                this.payload.failed = this.failed;
        }
    }
}

export namespace CreatePost {
    export class Success extends OkResponse<ICreatePost.Success> {
        constructor(public post: Post) {
            super(`Successfully created post ${post.title} (${post._id}).`, 201);
            this.payload.post = this.post;
        }
    }
}

export namespace RatePost {
    export class Success extends OkResponse<IRatePost.Success> {
        constructor(post: PostWrapper, rating: number, changed: boolean) {
            super(changed
                ? `Successfully rated post ${post.title} (${post.id}) with rating ${rating}.`
                : `No change from rating ${rating}.`
                , 201
            );
        }
    }
}

export namespace GetRates {
    export class Success extends OkResponse<IGetRates.Success> {
        constructor(user: UserWrapper, rates: Rates) {
            super(`Successfully found posts rated by user ${user.username} (${user.id}).`);
            this.payload.rates = rates;
        }
    }
}

export namespace GetUsers {
    export class Success extends OkResponse<IGetUsers.Success> {
        constructor(users: User[], allowed: string[] = [], blocked: string[] = []) {
            super(`Successfully found ${users.length} users.`);
            this.payload.users = users;
            if (allowed.length) this.payload['allowed-queries'] = allowed;
            if (blocked.length) this.payload['blocked-queries'] = blocked;
        }
    }
}

export namespace PostComment {
    export class Success extends OkResponse<IPostComment.Success> {
        constructor(comment: CommentWrapper) {
            super(`Successfully created comment ${comment.id}.`);
            this.payload.comment = comment.toInterface();
        }
    }
}

export namespace DeleteComment {
    export class Success extends OkResponse<IDeleteComment.Success> {
        constructor(comment: CommentWrapper, fullyDeleted: boolean) {
            super(`Successfully deleted comment ${comment.id}.`);
            this.payload.fullyDeleted = fullyDeleted;
        }
    }
}

export namespace GetComments {
    export class Success extends OkResponse<IGetComments.Success> {
        constructor(comments: Comment[], accepted?: string[], ignored?: string[], include?: boolean) {
            super(`Successfully found ${comments.length} comments.`);
            this.payload.comments = comments;
            if (accepted && accepted.length) this.payload.acceptedParams = accepted;
            if (ignored && ignored.length) this.payload.ignoredParams = ignored;
            if (include !== undefined && include !== null) this.payload.includeSuccessful = include;
        }
    }
    export class InvalidInputError extends ErrorResponse<IGetComments.IInvalidInputError> {
        constructor(allowed: string | string[], context: 'params', key: string, provided: string) {
            super('Invalid Input', '', 400);
            this.payload.allowed = allowed;
            this.payload.context = context;
            this.payload.key = key;
            this.payload.provided = provided;
        }
    }
}

export namespace RateComment {
    export class Success extends OkResponse<IRateComment.Success> {
        constructor(comment: CommentWrapper, rating: number, changed: boolean) {
            super(changed
                ? `Successfully rated comment ${comment.id} with rating ${rating}.`
                : `No change from rating ${rating}.`
                , 201
            );
            this.payload.change = changed;
        }
    }
}
