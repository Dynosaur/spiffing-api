import { MockPost } from './mock-post';
import { fillArray } from '../../tools';
import { MockCollection } from './mock-collection';

export class MockPostCollection extends MockCollection<MockPost> {

    constructor(fill = 0) {
        super();

        this.data.push(...fillArray(fill, () => new MockPost()));
    }

}
