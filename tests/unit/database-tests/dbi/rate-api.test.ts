import { RateAPI } from 'database/dbi/rate-api';
import { PostAPI } from 'database/dbi/post-actions';
import { ObjectId } from 'mongodb';
import { MockCollection } from 'tests/mock';
import { DatabaseInterface } from 'database/dbi/database-interface';
import { DbPost, DbRatedPosts } from 'database/data-types';

describe('RateAPI class', () => {
    let api: RateAPI;
    let dbi: DatabaseInterface<DbRatedPosts>;
    let ratedCollection: MockCollection<DbRatedPosts>;
    let postApi: PostAPI;
    let postDbi: DatabaseInterface<DbPost>;
    let postCollection: MockCollection<DbPost>;
    let uid = new ObjectId();
    beforeEach(() => {
        postCollection = new MockCollection();
        postDbi = new DatabaseInterface<DbPost>(postCollection as any);
        postApi = new PostAPI(postDbi, null);
        ratedCollection = new MockCollection<DbRatedPosts>();
        dbi = new DatabaseInterface(ratedCollection as any);
        api = new RateAPI(dbi, uid);
    });
    it('should create a new item if it does not exist', async done => {
        await api.initialize();
        expect(ratedCollection.data).toStrictEqual<DbRatedPosts[]>([{
            _id: expect.any(ObjectId),
            owner: uid,
            posts: []
        }]);
        done();
    });
    it('should add a like to the post and add the post to the rated list', async done => {
        await api.initialize();
        const post = await postApi.createPost(uid, 'Hello', 'World');
        expect(await api.likePost(post)).toBe(true);
        expect(postCollection.data).toContainEqual<DbPost>({
            _id: post.getId(),
            author: uid,
            comments: [],
            content: expect.any(String),
            dislikes: 0,
            likes: 1,
            title: expect.any(String)
        });
        expect(ratedCollection.data).toContainEqual<DbRatedPosts>({
            _id: expect.any(ObjectId),
            owner: uid,
            posts: [{
                _id: post.getId(),
                rating: 1
            }]
        });
        done();
    });
    it('should add a dislike to the post and add the post to the rated list', async done => {
        await api.initialize();
        const post = await postApi.createPost(uid, 'Hello', 'World');
        await api.dislikePost(post);
        expect(postCollection.data).toContainEqual<DbPost>({
            _id: post.getId(),
            author: uid,
            comments: [],
            content: expect.any(String),
            dislikes: 1,
            likes: 0,
            title: expect.any(String)
        });
        expect(ratedCollection.data).toContainEqual<DbRatedPosts>({
            _id: expect.any(ObjectId),
            owner: uid,
            posts: [{
                _id: post.getId(),
                rating: -1
            }]
        });
        done();
    });
    it('should unrate a rated post', async done => {
        await api.initialize();
        const post = await postApi.createPost(uid, 'Hello', 'World');
        expect(await api.likePost(post)).toBe(true);
        expect(await api.unratePost(post)).toBe(true);
        expect(postCollection.data).toContainEqual<DbPost>({
            _id: post.getId(),
            author: uid,
            comments: [],
            content: expect.any(String),
            dislikes: 0,
            likes: 0,
            title: expect.any(String)
        });
        expect(ratedCollection.data).toContainEqual<DbRatedPosts>({
            _id: expect.any(ObjectId),
            owner: uid,
            posts: []
        });
        expect(await api.dislikePost(post)).toBe(true);
        expect(await api.unratePost(post)).toBe(true);
        expect(postCollection.data).toContainEqual<DbPost>({
            _id: post.getId(),
            author: uid,
            comments: [],
            content: expect.any(String),
            dislikes: 0,
            likes: 0,
            title: expect.any(String)
        });
        expect(ratedCollection.data).toContainEqual<DbRatedPosts>({
            _id: expect.any(ObjectId),
            owner: uid,
            posts: []
        });
        done();
    });
    it('should undo a like when disliking, and undo a dislike when liking', async done => {
        await api.initialize();
        const post = await postApi.createPost(uid, 'Hello', 'World');
        expect(await api.likePost(post)).toBe(true);
        expect(await api.dislikePost(post)).toBe(true);
        expect(postCollection.data).toContainEqual<DbPost>({
            _id: post.getId(),
            author: uid,
            comments: [],
            content: expect.any(String),
            dislikes: 1,
            likes: 0,
            title: expect.any(String)
        });
        expect(ratedCollection.data).toContainEqual<DbRatedPosts>({
            _id: expect.any(ObjectId),
            owner: uid,
            posts: [{
                _id: post.getId(),
                rating: -1
            }]
        });
        expect(await api.likePost(post)).toBe(true);
        expect(postCollection.data).toContainEqual<DbPost>({
            _id: post.getId(),
            author: uid,
            comments: [],
            content: expect.any(String),
            dislikes: 0,
            likes: 1,
            title: expect.any(String)
        });
        expect(ratedCollection.data).toContainEqual<DbRatedPosts>({
            _id: expect.any(ObjectId),
            owner: uid,
            posts: [{
                _id: post.getId(),
                rating: 1
            }]
        });
        done();
    });
});
