import { User } from '../data-types';
import { AuthenticationError } from './error-responses';
import { ErrorResponse, OkResponse } from '../response';

export namespace Register {
    export namespace Failed {
        export interface UserExists extends ErrorResponse<'User Already Exists'> { }
        export type Tx = AuthenticationError.Tx | UserExists;
    }

    export namespace Ok {
        export interface Created extends OkResponse {
            status: 'Created';
            user: User;
        }
        export interface Test extends OkResponse { status: 'Test'; }
        export type Tx = Created | Test;
    }

    export type Tx = Failed.Tx | Ok.Tx;
}

export namespace Authenticate {
    export type Failed = AuthenticationError.Tx;
    export type Ok = OkResponse;
    export type Tx = Failed | Ok;
}

export namespace Deregister {
    export namespace Failed {
        export interface NoUser extends ErrorResponse<'No User'> { }
        export type Tx = AuthenticationError.Tx | NoUser;
    }

    export type Ok = OkResponse;

    export type Tx = Failed.Tx | Ok;
}

export namespace Patch {
    export namespace Failed {
        export interface NoUser extends ErrorResponse<'No User'> { }
        export type Tx = AuthenticationError.Tx | NoUser;
    }

    export namespace Ok {
        export interface Updated extends OkResponse {
            updated: string[];
        }
        export type Tx = Updated;
    }

    export type Tx = Failed.Tx | Ok.Tx;
}
