import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'api/services/api.service';
import { Comment, Post, User } from 'api/interface';
import { PostService } from 'services/post.service';
import { SnackbarService } from 'services/snackbar.service';
import { UserAccountService } from 'services/user-account.service';

interface PostUserIncluded extends Post {
    author: User;
}

interface CommentUserIncluded extends Comment {
    author: User;
}

@Component({
    selector: 'spiff-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
    readonly services: {
        readonly account: UserAccountService;
        readonly api: ApiService;
        readonly post: PostService;
        readonly route: ActivatedRoute;
        readonly snackbar: SnackbarService;
        readonly title: Title;
    }

    readonly state = {
        liked: false,
        disliked: false,
        commentsError: false,
        commentsLoading: true,
        postLoading: true,
        canDisplay: false,
        errorMessage: null
    };
    post: PostUserIncluded;

    commentControl = new FormControl();
    postingComment = false;
    comments: CommentUserIncluded[];
    commentsAmount: number;

    constructor(title: Title, route: ActivatedRoute, post: PostService, account: UserAccountService,
    snackbar: SnackbarService, api: ApiService) {
        this.services = { account, api, post, route, snackbar, title };
    }

    updateRatings(): void {
        if (this.services.account.ratedPosts.has(this.post._id)) {
            const rating = this.services.account.ratedPosts.get(this.post._id);
            this.state.liked = rating;
            this.state.disliked = !rating;
        } else {
            this.state.liked = false;
            this.state.disliked = false;
        }
    }

    ngOnInit(): void {
        this.services.route.params.subscribe(async params => {
            const postResponse = await this.services.api.getPosts(
                { id: params.id, include: 'authorUser' });
            this.state.postLoading = false;
            if (postResponse.ok === true) {
                if (postResponse.posts.length > 0) {
                    this.post = postResponse.posts[0] as PostUserIncluded;
                    this.state.canDisplay = true;
                    this.services.title.setTitle(this.post.title);
                    if (!this.services.account.user) {
                        this.services.account.events.subscribe((event: boolean) => {
                            if (event === true) this.updateRatings();
                        });
                    } else this.updateRatings();
                    this.commentsAmount = this.post.comments.length;
                    if (this.post.comments.length) {
                        const commentsRequest = await this.services.api.getComments(
                            { parent: { type: 'post', id: this.post._id } }, true
                        );
                        if (commentsRequest.ok) {
                            this.comments = commentsRequest.comments as CommentUserIncluded[];
                        } else {
                            this.state.commentsError = true;
                            this.services.snackbar.push('An error occurred while retrieving the comments.');
                            console.error(commentsRequest);
                        }
                        this.state.commentsLoading = false;
                    } else {
                        this.comments = [];
                        this.state.commentsLoading = false;
                    }
                } else {
                    this.state.canDisplay = false;
                    this.state.errorMessage = 'Not found.';
                }
            } else {
                this.state.canDisplay = false;
                this.state.errorMessage = postResponse.error;
            }
        });
    }

    async likePost(): Promise<void> {
        if (!this.services.account.user) {
            this.services.snackbar.push('Sorry, you must be logged in to do that.', 'OK', 5000);
            return;
        }
        if (this.state.liked) {
            const rateRequest = await this.services.account.ratePost(this.post._id, 0);
            if (rateRequest.ok === true) {
                this.services.account.ratedPosts.delete(this.post._id);
                this.state.liked = false;
                this.post.likes--;
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        } else {
            const rateRequest = await this.services.account.ratePost(this.post._id, 1);
            if (rateRequest.ok === true) {
                this.services.account.ratedPosts.set(this.post._id, true);
                this.state.liked = true;
                this.post.likes++;
                if (this.state.disliked) {
                    this.state.disliked = false;
                    this.post.dislikes--;
                }
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        }
    }

    async dislikePost(): Promise<void> {
        if (!this.services.account.user) {
            this.services.snackbar.push('Sorry, you must be logged in to do that.', 'OK', 5000);
            return;
        }
        if (this.state.disliked) {
            const rateRequest = await this.services.account.ratePost(this.post._id, 0);
            if (rateRequest.ok === true) {
                this.services.account.ratedPosts.delete(this.post._id);
                this.state.disliked = false;
                this.post.dislikes--;
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        } else {
            const rateRequest = await this.services.account.ratePost(this.post._id, -1);
            if (rateRequest.ok === true) {
                this.services.account.ratedPosts.set(this.post._id, false);
                this.state.disliked = true;
                this.post.dislikes++;
                if (this.state.liked) {
                    this.state.liked = false;
                    this.post.likes--;
                }
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        }
    }

    async likeComment(comment: CommentUserIncluded): Promise<void> {
        if (!this.services.account.user) {
            this.services.snackbar.push('Sorry, you must be logged in to do that.', 'OK', 5000);
            return;
        }
        const isUnrated = !this.services.account.ratedComments.has(comment._id);
        const isDisliked = this.services.account.ratedComments.get(comment._id) === false;
        if (isUnrated || isDisliked) {
            const likeRes = await this.services.account.rateComment(comment._id, 1);
            if (likeRes.ok) {
                if (this.services.account.ratedComments.get(comment._id) === false)
                    comment.dislikes--;
                this.services.account.ratedComments.set(comment._id, true);
                comment.likes++;
            } else {
                console.error(`Received an error while liking comment "${comment._id}"\n` +
                `${JSON.stringify(likeRes)}`);
                this.services.snackbar.push('An error occurred while liking that comment.');
            }
        } else {
            const unrateRes = await this.services.account.rateComment(comment._id, 0);
            if (unrateRes.ok) {
                this.services.account.ratedComments.delete(comment._id);
                comment.likes--;
            } else {
                console.error(`Received an error while unliking comment "${comment._id}"\n` +
                `${JSON.stringify(unrateRes)}`);
                this.services.snackbar.push('An error occurred while unrating that comment.');
            }
        }
    }

    async dislikeComment(comment: CommentUserIncluded): Promise<void> {
        if (!this.services.account.user) {
            this.services.snackbar.push('Sorry, you must be logged in to do that.', 'OK', 5000);
            return;
        }
        const isUnrated = !this.services.account.ratedComments.has(comment._id);
        const isLiked = this.services.account.ratedComments.get(comment._id) === true;
        if (isUnrated || isLiked) {
            const dislikeRes = await this.services.account.rateComment(comment._id, -1);
            if (dislikeRes.ok) {
                if (this.services.account.ratedComments.get(comment._id) === true)
                    comment.likes--;
                this.services.account.ratedComments.set(comment._id, false);
                comment.dislikes++;
            } else {
                console.error(`Received an error while disliking comment "${comment._id}"\n` +
                `${JSON.stringify(dislikeRes)}`);
                this.services.snackbar.push('An error occurred while disliking that comment.');
            }
        } else {
            const unrateRes = await this.services.account.rateComment(comment._id, 0);
            if (unrateRes.ok) {
                this.services.account.ratedComments.delete(comment._id);
                comment.dislikes--;
            } else {
                console.error(`Received an error while unrating comment "${comment._id}"\n` +
                    JSON.stringify(unrateRes));
                this.services.snackbar.push('An error occurred while unrating that comment.');
            }
        }
    }

    isCommentLiked(id: string): boolean {
        if (!this.services.account.user) return false;
        if (!this.services.account.ratedComments.has(id)) return false;
        return this.services.account.ratedComments.get(id);
    }

    isCommentDisliked(id: string): boolean {
        if (!this.services.account.user) return false;
        if (!this.services.account.ratedComments.has(id)) return false;
        return !this.services.account.ratedComments.get(id);
    }

    linkToProfile(username: string): string {
        return `/user/${username}`;
    }

    async postComment(): Promise<void> {
        if (!this.services.account.user) {
            this.services.snackbar.push('You must be logged in to comment.', '', 3000);
            return;
        }
        this.postingComment = true;
        const response = await this.services.account.postComment('post', this.post._id, this.commentControl.value);
        if (response.ok) {
            this.commentControl.reset();
            const commentCopy = { ...response.comment };
            commentCopy.author = this.services.account.user;
            this.commentsAmount = this.comments.push(commentCopy as CommentUserIncluded);
        } else {
            console.error('Received an error while posting comment.\n' + JSON.stringify(response));
            this.services.snackbar.push('Something went wrong while posting your comment.', 'OK', 5000);
        }
        this.postingComment = false;
    }

    numToDate(date: number): string {
        return new Date(date * 1000).toUTCString()
    }

    isAuthor(comment: CommentUserIncluded): boolean {
        return this.services.account.user?._id === comment.author._id;
    }
}
