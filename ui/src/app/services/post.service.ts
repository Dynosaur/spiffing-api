import { ApiService } from 'spiff/app/api/services/api.service';
import { IGetPost, Post } from 'spiff/app/api/interface';
import { Injectable, EventEmitter } from '@angular/core';

export class GetPostError extends Error {
    constructor(message: string, public error: IGetPost.ErrorTx['error']) {
        super(message);
    }
}

@Injectable({
    providedIn: 'root'
})
export class PostService {
    postEvents = new EventEmitter<string>();

    constructor(private api: ApiService) { }

    public async getPostsByUserId(id: string, includeAuthorUser = false): Promise<Post[]> {
        const postsRequest = await this.api.getPosts({ author: id, ...includeAuthorUser && { include: 'authorUser' } });
        if (postsRequest.ok === true) {
            return postsRequest.posts;
        } else {
            console.error(`Error while requesting posts: ${postsRequest.error}`);
            return [];
        }
    }

    async getPostById(id: string, includeAuthorUser = false): Promise<Post> {
        const postRequest = await this.api.getPosts({ id, ...includeAuthorUser && { include: 'authorUser' } });
        if (postRequest.ok === true) {
            return postRequest.posts[0];
        } else throw new GetPostError(`Error while requesting post ${id}: ${postRequest.error}`, postRequest.error);
    }
}
