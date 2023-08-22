import { CommentAPI, CommentWrapper } from 'database/comment';
import { PostAPI, PostWrapper } from 'database/post';
import { UserAPI, UserWrapper } from 'database/user';
import { CommonActions } from 'database/common-actions';
import { ObjectId } from 'mongodb';
import { randomBytes } from 'crypto';

export function generateComments(commentApi: CommentAPI, amount: number, author: ObjectId,
    parentType: 'comment' | 'post', parentId: ObjectId
): Promise<CommentWrapper[]> {
    const comments: Promise<CommentWrapper>[] = [];
    for (let i = 0; i < amount; i++)
        comments.push(commentApi.create(author, 'Content', parentType, parentId));
    return Promise.all(comments);
}

export function generateComment(api: CommentAPI, author: ObjectId, parentType: 'comment' | 'post',
    parentId: ObjectId
): Promise<CommentWrapper> {
    return api.create(author, 'Content', parentType, parentId);
}

export function generatePost(postApi: PostAPI, author: ObjectId): Promise<PostWrapper> {
    return postApi.create(author, randomBytes(4).toString('hex'), randomBytes(4).toString('hex'));
}

export function generatePosts(postApi: PostAPI, author: ObjectId, amount: number): Promise<PostWrapper[]> {
    const comments: Promise<PostWrapper>[] = [];
    for (let i = 0; i < amount; i++)
        comments.push(generatePost(postApi, author));
    return Promise.all(comments);
}

export function generateUser(userApi: UserAPI, common: CommonActions): Promise<UserWrapper> {
    return userApi.create(
        `user-${Math.round(Math.random() * 1000)}`,
        common.securePassword('password')
    );
}

export function generateUsers(userApi: UserAPI, common: CommonActions, amount: number): Promise<UserWrapper[]> {
    return Promise.all(new Array(amount).fill(null).map(() => generateUser(userApi, common)));
}
