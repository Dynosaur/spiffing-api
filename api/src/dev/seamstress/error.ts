export namespace SeamstressError {
    enum ECode {
        FILE_DOES_NOT_CONTAIN_INTERFACE = 1,
        COULD_NOT_FIND_INTERFACE_END = 2,
        FILE_NOT_FOUND = 3,
        FILE_QUERY_ERROR = 4
    }

    class BaseError extends Error {
        error: string;

        constructor(public code: ECode) {
            super(ECode[code]);
            this.error = ECode[code];
        }
    }

    export class FileNotFoundError extends BaseError {
        constructor(public path: string) {
            super(ECode.FILE_NOT_FOUND);
            this.message += `\nPath: ${path}`;
        }
    }

    export class FileDoesNotContainInterface extends BaseError {
        constructor(public path: string) {
            super(ECode.FILE_DOES_NOT_CONTAIN_INTERFACE);
            this.message += `\nPath: ${path}`;
        }
    }

    export class CouldNotFindInterfaceEnd extends BaseError {
        constructor(public path: string, public name: string) {
            super(ECode.COULD_NOT_FIND_INTERFACE_END);
            this.message += `\nPath: ${path}\nInterface name: ${name}`;
        }
    }

    export class FileQueryNotFound extends BaseError {
        constructor(public path: string, public name: string, public regex: string) {
            super(ECode.FILE_QUERY_ERROR);
        }
    }
}
