import { BoundPost } from 'app/database/dbi/post-actions';
import { OkResponse } from './response';
import { Post, User } from '../interface/data-types';
import { IGetPosts, IGetUser, IGetPost, ICreatePost, IRatePost } from 'interface/responses/api-responses';

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
