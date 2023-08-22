import { Injectable } from '@angular/core';
import { ApiHttpService } from 'api/services/api-http.service';
import { basicAuthorization } from 'spiff/app/util/basic-auth';
import {
    ICreateUser, IDeleteUser, IUpdateUser, IGetUser,
    IGetRate, IRateComment, IRatePost,
    ICreateComment, IGetComment,
    ICreatePost, IGetPost,
    IAuthorize
} from 'api/interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: ApiHttpService) {}

    register(username: string, password: string): Promise<ICreateUser.Tx> {
        return this.http.post(['api', 'user'], {}, {
            authorization: basicAuthorization(username, password)
        });
    }

    authorize(username: string, password: string): Promise<IAuthorize.Tx> {
        return this.http.post(['api', 'authorize'], {}, {
            authorization: basicAuthorization(username, password)
        });
    }

    deregister(username: string, password: string): Promise<IDeleteUser.Tx> {
        return this.http.delete(['api', 'user'], {
            authorization: basicAuthorization(username, password)
        });
    }

    patch(username: string, password: string, changes: {
        username?: string;
        password?: string;
        screenname?: string;
    }): Promise<IUpdateUser.Tx> {
        return this.http.patch(['api', 'user', username], changes, {
            authorization: basicAuthorization(username, password)
        });
    }

    getPosts(query: { author?: string; id?: string; ids?: string; include?: string; title?: string }
    ): Promise<IGetPost.Tx> {
        return this.http.get(['api', 'post'], query);
    }

    createPost(username: string, password: string, title: string, content: string): Promise<ICreatePost.Tx> {
        return this.http.post(['api', 'post'], { title, content },
            { authorization: basicAuthorization(username, password) }
        );
    }

    ratePost(username: string, password: string, postId: string, rating: -1 | 0 | 1): Promise<IRatePost.Tx> {
        return this.http.post(['api', 'rate', 'post', postId], { rating },
            { authorization: basicAuthorization(username, password) }
        );
    }

    getRates(username: string, password: string, uid: string): Promise<IGetRate.Tx> {
        return this.http.get(['api', 'rate', uid], {},
            { authorization: basicAuthorization(username, password) }
        );
    }

    getUsers(query: { id?: string; ids?: string[]; username?: string; usernames?: string[]; } = {}
    ): Promise<IGetUser.Tx> {
        return this.http.get(['api', 'user'], {
            ... query.id  && { id: query.id },
            ... query.ids && { ids: query.ids.join(',') },
            ... query.username  && { username: query.username },
            ... query.usernames && { usernames: query.usernames.join(',') }
        });
    }

    postComment(username: string, password: string, parentType: 'post' | 'comment', parentId: string, content: string
    ): Promise<ICreateComment.Tx> {
        return this.http.post(
            ['api', 'comment', parentType, parentId],
            { content },
            { authorization: basicAuthorization(username, password) }
        );
    }

    getComments(query: { parent?: { type: 'comment' | 'post'; id: string; }; author?: string; } = {},
    includeAuthorUser?: boolean): Promise<IGetComment.Tx> {
        return this.http.get(['api', 'comment'], {
            ...query.parent && { parentType: query.parent.type, parentId: query.parent.id },
            ...query.author && { author: query.author },
            ...includeAuthorUser !== undefined && { include: 'authorUser' }
        });
    }

    rateComment(username: string, password: string, commentId: string, rating: -1 | 0 | 1): Promise<IRateComment.Tx> {
        return this.http.post(['api', 'rate', 'comment', commentId], { rating },
            { authorization: basicAuthorization(username, password) }
        );
    }
}
