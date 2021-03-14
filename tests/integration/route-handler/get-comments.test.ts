import { FilterQuery }               from 'mongodb';
import { CommentWrapper, DbComment } from 'database/comment';
import { PostWrapper }               from 'database/post';
import { UserWrapper }               from 'database/user';
import { IGetComments }              from 'interface/responses/api-responses';
import { IMissingDataError, IObjectIdParseError }         from 'interface/responses/error-responses';
import { getComments }               from 'router/get-comments';
import { IntegrationEnvironment }    from 'tests/mock/integration-environment';

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
        const response = await env.executeRouteHandler(getComments);
        expect(spy).toHaveBeenCalledWith({});
        expect(response.payload).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: comments.concat(subcomment).concat(secondComments).map(comment => comment.toInterface())
        });
        done();
    });
    it('should require parentType AND parentId', async done => {
        env.request.query.parentType = 'post';
        let response = await env.executeRouteHandler(getComments);
        expect(response.payload).toStrictEqual<IMissingDataError>({
            ok: false,
            error: 'Missing Data',
            missing: {
                'scope-name': 'params',
                received: ['parentType'],
                required: ['parentId']
            }
        });
        delete env.request.query.parentType;
        env.request.query.parentId = post.id;
        response = await env.executeRouteHandler(getComments);
        expect(response.payload).toStrictEqual<IMissingDataError>({
            ok: false,
            error: 'Missing Data',
            missing: {
                'scope-name': 'params',
                received: ['parentId'],
                required: ['parentType']
            }
        });
        done();
    });
    it('should require parentType should be \'comment\' or \'post\'', async done => {
        env.request.query.parentType = 'random';
        env.request.query.parentId = post.id;
        const response = await env.executeRouteHandler(getComments);
        expect(response.payload).toStrictEqual<IGetComments.IInvalidInputError>({
            ok: false,
            error: 'Invalid Input',
            allowed: ['comment', 'post'],
            context: 'params',
            key: 'parentType',
            provided: 'random'
        });
        done();
    });
    it('should require parentId to be an ObjectId', async done => {
        env.request.query.parentType = 'post';
        env.request.query.parentId = 'random';
        const response = await env.executeRouteHandler(getComments);
        expect(response.payload).toStrictEqual<IObjectIdParseError>({
            ok: false,
            error: 'Object Id Parse',
            provided: 'random'
        });
        done();
    });
    it('should get all comments under a post', async done => {
        env.request.query.parentType = 'post';
        env.request.query.parentId = post.id;
        const spy = jest.spyOn(env.db.collection.comments, 'find');
        let response = await env.executeRouteHandler(getComments);
        expect(spy).toHaveBeenCalledWith<[FilterQuery<DbComment>]>({
            parent: {
                _id: post._id,
                contentType: 'post'
            }
        });
        expect(response.payload).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: comments.map(comment => comment.toInterface()),
            acceptedParams: ['parentId', 'parentType']
        });
        spy.mockClear();
        env.request.query.parentId = secondPost.id;
        env.request.query.parentType = 'post';
        response = await env.executeRouteHandler(getComments);
        expect(spy).toHaveBeenCalledWith<[FilterQuery<DbComment>]>({
            parent: {
                _id: secondPost._id,
                contentType: 'post'
            }
        });
        expect(response.payload).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: secondComments.map(comment => comment.toInterface()),
            acceptedParams: ['parentId', 'parentType']
        });
        done();
    });
    it('should get comments under a comment', async done => {
        env.request.query.parentType = 'comment';
        env.request.query.parentId = comments[0].id;
        const spy = jest.spyOn(env.db.collection.comments, 'find');
        const response = await env.executeRouteHandler(getComments);
        expect(spy).toHaveBeenCalledWith<[FilterQuery<DbComment>]>({
            parent: {
                _id: comments[0]._id,
                contentType: 'comment'
            }
        });
        expect(response.payload).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: [subcomment.toInterface()],
            acceptedParams: ['parentId', 'parentType']
        });
        done();
    });
    it('should require author param to be an ObjectId', async done => {
        env.request.query.author = 'random';
        const response = await env.executeRouteHandler(getComments);
        expect(response.payload).toStrictEqual<IObjectIdParseError>({
            ok: false,
            error: 'Object Id Parse',
            provided: 'random'
        });
        done();
    });
    it('should get comments made by a user', async done => {
        env.request.query.author = users[1].id;
        const response = await env.executeRouteHandler(getComments);
        expect(response.payload).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: secondComments.map(comment => comment.toInterface()),
            acceptedParams: ['author']
        });
        done();
    });
    it('should ignore unrecognized include values', async done => {
        env.request.query.include = 'random';
        env.request.query.author = users[0].id;
        const response = await env.executeRouteHandler(getComments);
        expect(response.payload).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: comments.map(comment => comment.toInterface()),
            acceptedParams: ['author'],
            ignoredParams: ['include']
        });
        done();
    });
    it('should include author\'s user object', async done => {
        env.request.query.include = 'authorUser';
        env.request.query.author = users[0].id;
        const response = await env.executeRouteHandler(getComments);
        expect(response.payload).toStrictEqual<IGetComments.Success>({
            ok: true,
            comments: comments.map(comment => comment.toInterface(users[0].toInterface())),
            acceptedParams: ['author', 'include'],
            includeSuccessful: true
        });
        done();
    });
});
