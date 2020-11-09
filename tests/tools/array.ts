import { MockPost, MockUser } from '../mock';

export function fillArray<T>(length: number, fn: () => T): T[] {
    return new Array(length).fill(null).map(fn);
}

export function fillUsers(length: number, username?: string, password?: string, screenname?: string): MockUser[] {
    return fillArray<MockUser>(length, () => new MockUser(password, screenname, username));
}

export function fillPosts(length: number, author?: string, content?: string, title?: string): MockPost[] {
    return fillArray<MockPost>(length, () => new MockPost(author, content, title));
}
