import { Collection, Db } from 'mongodb';
import { Post } from '../server/interface';

export class PostActions {

    constructor(private posts: Collection<Post>) { }

    public async create(title: string, content: string, authorUsername: string): Promise<void> {
        await this.posts.insertOne({
            title,
            content,
            author: authorUsername,
            date: Date.now()
        });
    }

    public async getPosts(query: object): Promise<Post[]> {
        const cursor = this.posts.find(query);
        const posts: Post[] = [];
        while (await cursor.hasNext()) posts.push(await cursor.next());
        return posts;
    }
}