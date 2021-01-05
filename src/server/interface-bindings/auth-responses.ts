import { User } from '../interface/data-types';
import { BoundUser } from 'app/database/dbi/user-api';
import { ErrorResponse, OkResponse } from './response';
import { IAuthorize, IDeregister, IPatch, IRegister } from 'interface/responses/auth-endpoints';

export namespace Register {
    export class UserExistsError extends ErrorResponse<IRegister.Failed.UserExists> {
        constructor(username: string) {
            super('User Already Exists', `A user with the username ${username} already exists.`, 200);
        }
    }

    export class Success extends OkResponse<IRegister.Success> {
        constructor(public user: User) {
            super(`Successfully created user ${user.username} (${user._id}).`, 201);
            this.payload.user = this.user;
        }
    }
}

export namespace Authorize {
    export class Success extends OkResponse<IAuthorize.Success> {
        constructor(user: BoundUser) {
            super(`Successfully authorized user ${user.username} (${user._id.toHexString()}).`);
        }
    }
}

export namespace Deregister {
    export class Success extends OkResponse<IDeregister.Success> {
        constructor(user: BoundUser) {
            super(`Successfully deleted user ${user.username} (${user._id.toHexString()}).`);
        }
    }
}

export namespace Patch {
    export class Success extends OkResponse<IPatch.Success> {
        constructor(user: BoundUser, public updated: string[], public rejected: string[]) {
            super(`Successfully deleted user ${user.username} (${user._id.toHexString()}).`);
            this.payload.updated = this.updated;
            this.payload['rejected-props'] = this.rejected;
        }
    }
}
