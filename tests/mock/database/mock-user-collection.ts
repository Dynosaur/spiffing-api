import { MockUser } from './mock-user';
import { fillArray } from '../../tools/array';
import { MockCollection } from './mock-collection';

export class MockUserCollection extends MockCollection<MockUser> {

    constructor(fill = 0) {
        super();

        this.data.push(...fillArray(fill, () => new MockUser()));
    }

}
