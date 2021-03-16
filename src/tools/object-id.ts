import { ObjectId } from 'mongodb';
import { ObjectIdParse } from 'interface/error/object-id-parse';

const errorMessage = 'Argument passed in must be a single String of 12 bytes' +
                     ' or a string of 24 hex characters';

type ReturnType =
    | { ok: true; id: ObjectId; }
    | { ok: false; error: ObjectIdParse }

export function parseObjectId(context: string, id: string): ReturnType {
    if (id === undefined || id === null) return {
        error: new ObjectIdParse(context, id),
        ok: false
    };
    try {
        const objectId = new ObjectId(id);
        return { id: objectId, ok: true };
    } catch (e) {
        if (e.message === errorMessage) return {
            error: new ObjectIdParse(context, id),
            ok: false
        };
        else throw e;
    }
}
