import { DbPost } from '../../../src/database/data-types';
import { ObjectId } from 'mongodb';
import { testUsername } from './mock-user';

export class MockPost implements DbPost {

    static defaultContent = `For many experiments, it is possible to think of the initial and final conditions of
    the system as being a particle. In some cases it appears that there are potentially several spatially distinct
    pathways or trajectories by which a particle might pass from initial to final condition.`;
    static defaultTitle = 'Copenhagen Interpretation of Quantum Versus Classical Kinematics';

    _id: ObjectId;
    author: string;
    content: string;
    title: string;

    constructor(author?: string, content?: string, title?: string) {
        this._id = new ObjectId();
        this.author = author || testUsername();
        this.content = content || MockPost.defaultContent;
        this.title = title || MockPost.defaultTitle;
    }

}
