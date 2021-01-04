import { ErrorResponse } from '../response';

export interface IObjectIdParseError extends ErrorResponse<'Object Id Parse'> {
    provided: string;
}

export interface INoUserFoundError extends ErrorResponse<'No User Found'> {
    id: string;
}

export interface INoPostFoundError extends ErrorResponse<'No Post Found'> {
    id: string;
}

export interface IMissingDataError extends ErrorResponse<'Missing Data'> {
    missing: {
        received: string[];
        'scope-name': string;
        required: string[];
    };
}
