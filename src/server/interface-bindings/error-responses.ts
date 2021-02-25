import { ErrorResponse } from './response';
import { IAuthHeaderIdParamMismatchError, IAuthorizationParseError, IMissingDataError, INoCommentFoundError, INoPostFoundError, INoUserFoundError,
IObjectIdParseError, IUnauthenticatedError, IUnauthorizedError, IIllegalValueError } from 'interface/responses/error-responses';

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
        this.payload.id = this.id;
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

export class AuthorizationParseError extends ErrorResponse<IAuthorizationParseError> {
    constructor(public part: 'Authorization Type' | 'Username' | 'Password') {
        super('Authorization Parsing Error', `Couldn't parse part of the authorization header: ${part}.`, 400);
        this.payload.part = this.part;
    }
}

export class UnauthenticatedError extends ErrorResponse<IUnauthenticatedError> {
    constructor() {
        super('Unauthenticated', 'Request was unauthenticated.', 401);
    }
}

export class UnauthorizedError extends ErrorResponse<IUnauthorizedError> {
    constructor() {
        super('Unauthorized', 'Request was unauthorized.', 403);
    }
}

export class AuthHeaderIdParamError extends ErrorResponse<IAuthHeaderIdParamMismatchError> {
    constructor(public header: string, public param: string) {
        super(
            'Authorization Header and Id Param Mismatch',
            'The authorization header is the credentials to a different user than the one specified in the request param id.',
            400
        );
        this.payload.headerId = this.header;
        this.payload.paramId = this.param;
    }
}

export class NoCommentFoundError extends ErrorResponse<INoCommentFoundError> {
    constructor(public id: string) {
        super('No Comment Found', `Could not find post ${id}.`, 404);
        this.payload.id = this.id;
    }
}

export class IllegalValueError extends ErrorResponse<IIllegalValueError> {
    constructor(public value: any, public allowed: any[], public context: string) {
        super('Illegal Value', `Illegal value '${JSON.stringify(value)}' in request ${context}.`);
        this.payload.allowedValues = allowed;
        this.payload.providedValue = value;
        this.payload.context = context;
    }
}
