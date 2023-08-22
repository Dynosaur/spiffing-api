import { Injectable, EventEmitter } from '@angular/core';
import { User } from 'api/interface';
import { ApiService } from 'api/services/api.service';
import {
    ICreatePost,
    IDeleteUser,
    IGetRate,
    IUpdateUser,
    ICreateComment,
    IRateComment,
    IRatePost
} from 'api/interface';
import {
    LOCAL_STORAGE_ACCOUNT_KEY,
    LocalStorageService
} from 'services/local-storage.service';

export type UserAccountEvent = 'LOG_IN' | 'LOG_OUT' | 'PASSWORD_CHANGE';

@Injectable({
    providedIn: 'root'
})
export class UserAccountService {
    password: string;
    user: User = null;
    events = new EventEmitter<UserAccountEvent>();
    ratedPosts = new Map<string, boolean>();
    ratedComments = new Map<string, boolean>();

    constructor(private ls: LocalStorageService, private api: ApiService) { }

    async login(username: string, password: string): Promise<boolean> {
        const authenticateRequest = await this.api.authorize(username, password);
        if (authenticateRequest.ok) {
            this.password = password;
            const getUserRes = await this.api.getUsers({ username });
            if (getUserRes.ok) {
                this.user = getUserRes.users[0];
                const getRatesRes = await this.getRates();
                if (getRatesRes.ok) {
                    for (const postId of getRatesRes.rates.posts.liked)
                        this.ratedPosts.set(postId, true);
                    for (const postId of getRatesRes.rates.posts.disliked)
                        this.ratedPosts.set(postId, false);
                    for (const commentId of getRatesRes.rates.comments.liked)
                        this.ratedComments.set(commentId, true);
                    for (const commentId of getRatesRes.rates.comments.disliked)
                        this.ratedComments.set(commentId, false);
                } else {
                    console.error('Received an error from the API while requesting user' +
                    'rates during login.\n' + JSON.stringify(getRatesRes));
                    return false;
                }
                this.events.emit('LOG_IN');
            } else {
                console.error('Received an error from the API while requesting user\n' +
                JSON.stringify(getUserRes));
                return false;
            }
            this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username, password });
            return true;
        }
        return false;
    }

    logOut(): void {
        this.user = null;
        this.ls.delete(LOCAL_STORAGE_ACCOUNT_KEY);
        this.ratedComments.clear();
        this.ratedPosts.clear();
        this.events.emit('LOG_OUT');
    }

    async deregister(): Promise<IDeleteUser.Tx> {
        const deregisterResponse = await this.api.deregister(this.user.username, this.password);
        if (deregisterResponse.ok === true) this.logOut();
        return deregisterResponse;
    }

    patch(changes: {
        username?: string;
        password?: string;
        screenname?: string;
    }): Promise<IUpdateUser.Tx> {
        return this.api.patch(this.user.username, this.password, changes);
    }

    createPost(title: string, content: string): Promise<ICreatePost.Tx> {
        return this.api.createPost(this.user.username, this.password, title, content);
    }

    ratePost(postId: string, rating: -1 | 0 | 1): Promise<IRatePost.Tx> {
        return this.api.ratePost(this.user.username, this.password, postId, rating);
    }

    getRates(): Promise<IGetRate.Tx> {
        return this.api.getRates(this.user.username, this.password, this.user._id);
    }

    postComment(parentType: 'post' | 'comment', parentId: string, content: string): Promise<ICreateComment.Tx> {
        return this.api.postComment(this.user.username, this.password, parentType, parentId, content);
    }

    rateComment(commentId: string, rating: -1 | 0 | 1): Promise<IRateComment.Tx> {
        return this.api.rateComment(this.user.username, this.password, commentId, rating);
    }

    usernameChanged(newUsername: string): void {
        this.user.username = newUsername;
        this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username: newUsername, password: this.password });
    }

    passwordChanged(password: string): void {
        this.password = password;
        this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username: this.user.username, password: this.password });
        this.events.emit('PASSWORD_CHANGE');
    }
}
