import { OkResponse } from './response';
import { PostWrapper } from 'database/post';
import { UserWrapper } from 'database/user';
import { CommentWrapper } from 'database/comment';
import { Post, RatedPosts, User } from 'interface/data-types';
import {
    IGetPosts,
    IGetUsers,
    IRatePost,
    ICreatePost,
    IPostComment,
    IDeleteComment,
    IGetRatedPosts
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
