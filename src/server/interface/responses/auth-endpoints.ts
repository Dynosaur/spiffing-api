import { User } from '../data-types';
import { Automated } from './error-responses';
import { ErrorResponse, OkResponse } from '../response';

export namespace Register {
    export namespace Failed {
        export interface UserExists extends ErrorResponse<'User Already Exists'> { }
        export type Tx = Automated.Tx | UserExists;
    }

    export namespace Ok {
        export interface Created extends OkResponse {
            user: User;
        }
        export type Tx = Created;
    }

    export type Tx = Failed.Tx | Ok.Tx;
}

export namespace Authenticate {
    export type Failed = Automated.Tx;
    export type Ok = OkResponse;
    export type Tx = Failed | Ok;
}

export namespace Deregister {
    export namespace Failed {
        export interface NoUser extends ErrorResponse<'No User'> { }
        export type Tx = Automated.Tx | NoUser;
    }

    export type Ok = OkResponse;

    export type Tx = Failed.Tx | Ok;
}

export namespace Patch {
    export namespace Failed {
        export interface NoUser extends ErrorResponse<'No User'> { }
        export type Tx = Automated.Tx | NoUser;
    }

    export namespace Ok {
        export interface Updated extends OkResponse {
            updated: string[];
        }
        export type Tx = Updated;
    }

    export type Tx = Failed.Tx | Ok.Tx;
}
