import { randomBytes } from 'crypto';
import { ObjectId }    from 'bson';
import { CommentAPI, CommentWrapper } from 'database/comment';
import { CommonActions }              from 'database/common-actions';
import { PostAPI, PostWrapper }       from 'database/post';
import { UserAPI, UserWrapper }       from 'database/user';

export async function generateComments(commentApi: CommentAPI, amount: number, author: ObjectId,
    parentType: 'comment' | 'post', parentId: ObjectId
): Promise<CommentWrapper[]> {
    const comments: CommentWrapper[] = [];
    for (let i = 0; i < amount; i++)
        comments.push(await commentApi.create(author, 'Content', parentType, parentId));
    return comments;
}

export function generateComment(api: CommentAPI, author: ObjectId, parentType: 'comment' | 'post',
    parentId: ObjectId
): Promise<CommentWrapper> {
    return api.create(author, 'Content', parentType, parentId);
}

export function generatePost(postApi: PostAPI, author: ObjectId): Promise<PostWrapper> {
    return postApi.create(author, randomBytes(4).toString('hex'), randomBytes(4).toString('hex'));
}

export function generateUser(userApi: UserAPI, common: CommonActions): Promise<UserWrapper> {
    return userApi.create(
        `user-${Math.round(Math.random() * 1000)}`,
        common.securePassword('password')
    );
}
