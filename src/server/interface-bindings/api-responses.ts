import { BoundPost } from 'database/dbi/post-actions';
import { BoundUser } from 'database/dbi/user-api';
import { OkResponse } from './response';
import { Post, RatedPosts, User } from 'interface/data-types';
import { IGetPosts, IGetUser, IGetPost, ICreatePost, IRatePost, IGetRatedPosts, IGetUsers } from 'interface/responses/api-responses';

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
            super(changed ? `Successfully rated post ${post.getTitle()} (${post.id}) with rating ${rating}.` : `No change from rating ${rating}.`, 201);
        }
    }
}

export namespace GetRatedPosts {
    export class Success extends OkResponse<IGetRatedPosts.Success> {
        constructor(user: BoundUser, ratedPosts: RatedPosts) {
            super(`Successfully found posts rated by user ${user.username} (${user.id}).`);
            this.payload.ratedPosts = ratedPosts;
        }
    }
}

export namespace GetUsers {
    export class Success extends OkResponse<IGetUsers.Success> {
        constructor(users: User[], missing: string[]) {
            super(`Successfully found ${users.length} users${missing.length ? `, but did not find ${missing.length} users.` : '.'}`);
            this.payload.missing = missing;
            this.payload.users = users;
        }
    }
}
