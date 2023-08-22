import { CommentWrapper, DbComment } from 'database/comment';
import { IGetComment, getComment } from 'router/comment/get';
import { FilterQuery } from 'mongodb';
import { IIllegalValue } from 'interface/error/illegal-value';
import { IMissing } from 'interface/error/missing';
import { IObjectIdParse } from 'interface/error/object-id-parse';
import { IntegrationEnvironment } from 'tests/mock/integration-environment';
import { PostWrapper } from 'database/post';
import { UserWrapper } from 'database/user';

describe('get-comments route handler', () => {
    let env: IntegrationEnvironment;
    let users: UserWrapper[];
    let post: PostWrapper;
    let secondPost: PostWrapper;
    let comments: CommentWrapper[];
    let secondComments: CommentWrapper[];
    let subcomment: CommentWrapper;
    beforeEach(async done => {
        env = new IntegrationEnvironment('get-comments');
        await env.initialize();
        users = await env.generateUsers(3);
        post = await env.generatePost(users[0]._id);
        secondPost = await env.generatePost(users[1]._id);
        comments = await env.generateComments(3, users[0]._id, 'post', post._id);
        subcomment = await env.generateComment(users[2]._id, 'comment', comments[0]._id);
        comments[0] = (await env.api.comment.get(comments[0]._id))!;
        secondComments = await env.generateComments(2, users[1]._id, 'post', secondPost._id);
        done();
    });
    afterEach(async done => {
        await env.destroy();
        done();
    });
    it('should get all comments', async done => {
        const spy = jest.spyOn(env.actions.comment, 'getManyByFilter');
        const response = await env.executeRouteHandler(getComment);
        expect(spy).toHaveBeenCalledWith({});
        expect(response.payload).toStrictEqual<IGetComment.Success>({
            comments: comments.concat(subcomment).concat(secondComments).map(comment => comment.toInterface()),
            ok: true
        });
        done();
    });
    it('should require parentType AND parentId', async done => {
        env.request.query.parentType = 'post';
        let response = await env.executeRouteHandler(getComment);
        expect(response.payload).toStrictEqual<IMissing>({
            error: 'Missing Item',
            field: 'query',
            name: 'parentId',
            ok: false
        });
        delete env.request.query.parentType;
        env.request.query.parentId = post.id;
        response = await env.executeRouteHandler(getComment);
        expect(response.payload).toStrictEqual<IMissing>({
            allowedValues: ['comment', 'post'],
            error: 'Missing Item',
            field: 'query',
            name: 'parentType',
            ok: false
        });
        done();
    });
    it('should require parentType should be \'comment\' or \'post\'', async done => {
        env.request.query.parentType = 'random';
        env.request.query.parentId = post.id;
        const response = await env.executeRouteHandler(getComment);
        expect(response.payload).toStrictEqual<IIllegalValue>({
            allowed: ['comment', 'post'],
            context: 'query.parentType',
            error: 'Illegal Value',
            ok: false,
            value: 'random'
        });
        done();
    });
    it('should require parentId to be an ObjectId', async done => {
        env.request.query.parentType = 'post';
        env.request.query.parentId = 'random';
        const response = await env.executeRouteHandler(getComment);
        expect(response.payload).toStrictEqual<IObjectIdParse>({
            context: 'query.parentId',
            error: 'Object Id Parse',
            ok: false,
            provided: 'random'
        });
        done();
    });
    it('should get all comments under a post', async done => {
        env.request.query.parentType = 'post';
        env.request.query.parentId = post.id;
        const spy = jest.spyOn(env.db.collection.comments, 'find');
        let response = await env.executeRouteHandler(getComment);
        expect(spy).toHaveBeenCalledWith<[FilterQuery<DbComment>]>({
            parent: {
                _id: post._id,
                contentType: 'post'
            }
        });
        expect(response.payload).toStrictEqual<IGetComment.Success>({
            acceptedParams: ['parentId', 'parentType'],
            comments: comments.map(comment => comment.toInterface()),
            ok: true
        });
        spy.mockClear();
        env.request.query.parentId = secondPost.id;
        env.request.query.parentType = 'post';
        response = await env.executeRouteHandler(getComment);
        expect(spy).toHaveBeenCalledWith<[FilterQuery<DbComment>]>({
            parent: {
                _id: secondPost._id,
                contentType: 'post'
            }
        });
        expect(response.payload).toStrictEqual<IGetComment.Success>({
            acceptedParams: ['parentId', 'parentType'],
            comments: secondComments.map(comment => comment.toInterface()),
            ok: true
        });
        done();
    });
    it('should get comments under a comment', async done => {
        env.request.query.parentType = 'comment';
        env.request.query.parentId = comments[0].id;
        const spy = jest.spyOn(env.db.collection.comments, 'find');
        const response = await env.executeRouteHandler(getComment);
        expect(spy).toHaveBeenCalledWith<[FilterQuery<DbComment>]>({
            parent: {
                _id: comments[0]._id,
                contentType: 'comment'
            }
        });
        expect(response.payload).toStrictEqual<IGetComment.Success>({
            acceptedParams: ['parentId', 'parentType'],
            comments: [subcomment.toInterface()],
            ok: true
        });
        done();
    });
    it('should require author param to be an ObjectId', async done => {
        env.request.query.author = 'random';
        const response = await env.executeRouteHandler(getComment);
        expect(response.payload).toStrictEqual<IObjectIdParse>({
            context: 'query.author',
            error: 'Object Id Parse',
            ok: false,
            provided: 'random'
        });
        done();
    });
    it('should get comments made by a user', async done => {
        env.request.query.author = users[1].id;
        const response = await env.executeRouteHandler(getComment);
        expect(response.payload).toStrictEqual<IGetComment.Success>({
            acceptedParams: ['author'],
            comments: secondComments.map(comment => comment.toInterface()),
            ok: true
        });
        done();
    });
    it('should not ignore unrecognized include values', async done => {
        env.request.query.include = 'random';
        env.request.query.author = users[0].id;
        const response = await env.executeRouteHandler(getComment);
        expect(response.payload).toStrictEqual<IIllegalValue>({
            allowed: ['authorUser'],
            context: 'query.include',
            error: 'Illegal Value',
            ok: false,
            value: 'random'
        });
        done();
    });
    it('should include author\'s user object', async done => {
        env.request.query.include = 'authorUser';
        env.request.query.author = users[0].id;
        const response = await env.executeRouteHandler(getComment);
        expect(response.payload).toStrictEqual<IGetComment.Success>({
            acceptedParams: ['author', 'include'],
            comments: comments.map(comment => comment.toInterface(users[0].toInterface())),
            ok: true
        });
        done();
    });
});
