import { BoundPost } from 'database/dbi/post-actions';
import { UserWrapper } from 'app/database/user/wrapper';
import { OkResponse } from './response';
import { Post, RatedPosts, User } from 'interface/data-types';
import { IGetPosts, IGetUser, IGetPost, ICreatePost, IRatePost, IGetRatedPosts, IGetUsers, IPostComment, IDeleteComment } from 'interface/responses/api-responses';
import { CommentWrapper } from 'app/database/comment/wrapper';

export namespace GetUser {
    export class Success extends OkResponse<IGetUser.Success> {
        constructor(public user: User) {
            super(`Successfully found user ${user.username} (${user._id}).`);
            this.payload.user = this.user;
        }
    }
}

export namespace GetPosts {
    export class Success extends OkResponse<IGetPosts.Success> {
        constructor(public posts: Post[], public allowed: string[], public blocked: string[]) {
            super(`Successfully found ${posts.length} posts.`);
            this.payload.posts = this.posts;
            if (this.allowed.length)
                this.payload['query-allowed'] = this.allowed;
            if (this.blocked.length)
                this.payload['query-blocked'] = this.blocked;
        }
    }
}

export namespace GetPost {
    export class Success extends OkResponse<IGetPost.Success> {
        constructor(public post: Post) {
            super(`Successfully found post ${post.title} (${post._id}).`);
            this.payload.post = this.post;
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
        constructor(post: BoundPost, rating: number, changed: boolean) {
            super(changed
                ? `Successfully rated post ${post.getTitle()} (${post.getIdString()}) with rating ${rating}.`
                : `No change from rating ${rating}.`
                , 201
            );
        }
    }
}

export namespace GetRatedPosts {
    export class Success extends OkResponse<IGetRatedPosts.Success> {
        constructor(user: UserWrapper, ratedPosts: RatedPosts) {
            super(`Successfully found posts rated by user ${user.username} (${user.id}).`);
            this.payload.ratedPosts = ratedPosts;
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
