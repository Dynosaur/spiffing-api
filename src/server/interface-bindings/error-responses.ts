import { ErrorResponse } from './response';
import { IMissingDataError, INoPostFoundError, INoUserFoundError, IObjectIdParseError } from 'interface/responses/error-responses';

export class ObjectIdParseError extends ErrorResponse<IObjectIdParseError> {
    constructor(public provided: string) {
        super('Object Id Parse', `Could not parse ${provided} into an ObjectId.`, 400);
        this.payload.provided = this.provided;
    }
}

export class NoUserFoundError extends ErrorResponse<INoUserFoundError> {
    constructor(public id: string) {
        super('No User Found', `Could not find user ${id}.`, 404);
        this.payload.id = this.id;
    }
}

export class NoPostFoundError extends ErrorResponse<INoPostFoundError> {
    constructor(public id: string) {
        super('No Post Found', `Could not find post ${id}.`, 404);
        this.payload.id;
    }
}

export class MissingDataError extends ErrorResponse<IMissingDataError> {
    constructor(public scopeName: string, public received: string[], public required: string[]) {
        super('Missing Data', `Request was missing some data from the required list: ${required.join(', ')}.`, 400);
        this.payload.missing = {
            received: this.received,
            required: this.required,
            'scope-name': this.scopeName
        };
    }
}
