import { ObjectId } from 'mongodb';
import { ObjectIdParseError } from 'interface-bindings/error-responses';

const errorMessage = 'Argument passed in must be a single String of 12 bytes' +
                     ' or a string of 24 hex characters';

type ReturnType =
    | { ok: true; id: ObjectId; }
    | { ok: false; error: ObjectIdParseError }

export function parseObjectId(id: string): ReturnType {
    if (id === undefined || id === null) return {
        ok: false,
        error: new ObjectIdParseError(id)
    };
    try {
        const objectId = new ObjectId(id);
        return { ok: true, id: objectId };
    } catch (e) {
        if (e.message === errorMessage) return {
            ok: false,
            error: new ObjectIdParseError(id)
        };
        else throw e;
    }
}
