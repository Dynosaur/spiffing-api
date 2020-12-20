import { ErrorResponse } from '../response';

export namespace Automated {
    export namespace Failed {
        export namespace Database {
            export interface NoConnection extends ErrorResponse<'No Connection to Database'> { }

            export type Tx = NoConnection;
        }

        export interface Parse extends ErrorResponse<'Authorization Header Parse'> {
            field: 'username' | 'password' | 'type' | 'username param';
        }

        export interface MissingData extends ErrorResponse<'Missing Requirements'> {
            missing: {
                possible: string[][];
                provided: string[];
                scope: string;
            };
        }

        export interface Unauthorized extends ErrorResponse<'Authorization Failed'> { }

        export interface Unknown extends ErrorResponse<'Unknown'> {
            errorObject: object;
        }

        export type Tx = Database.Tx | MissingData | Parse | Unauthorized | Unknown;
    }

    export type Tx = Failed.Tx;
}
