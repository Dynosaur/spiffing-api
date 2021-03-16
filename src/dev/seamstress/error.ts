export namespace SeamstressError {
    enum ECode {
        FILE_DOES_NOT_CONTAIN_INTERFACE = 1,
        COULD_NOT_FIND_INTERFACE_END = 2,
        FILE_NOT_FOUND = 3
    }

    class BaseError extends Error {
        constructor(public code: ECode) {
            super(ECode[code]);
        }
    }

    export class FileNotFoundError extends BaseError {
        constructor(path: string) {
            super(ECode.FILE_NOT_FOUND);
            this.message += `\nPath: ${path}`;
        }
    }

    export class FileDoesNotContainInterface extends BaseError {
        constructor(path: string) {
            super(ECode.FILE_DOES_NOT_CONTAIN_INTERFACE);
            this.message += `\nPath: ${path}`;
        }
    }

    export class CouldNotFindInterfaceEnd extends BaseError {
        constructor(path: string, name: string) {
            super(ECode.COULD_NOT_FIND_INTERFACE_END);
            this.message += `\nPath: ${path}\nInterface name: ${name}`;
        }
    }
}
