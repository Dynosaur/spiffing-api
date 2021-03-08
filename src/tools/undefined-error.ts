/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

export class UndefinedError extends Error {
    constructor(what: string, item: any) {
        super(`${what} is ${item}.`);
    }
}
