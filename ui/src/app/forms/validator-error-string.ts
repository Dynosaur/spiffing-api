export function errorsToString(errorObj: object): string {
    for (const errorName of Object.keys(errorObj)) {
        switch (errorName) {
            case 'sameValue':
                return 'Does not match.';
            case 'required':
                return 'This field is required.';
            case 'mustNotEqual':
                return `Must not equal ${errorObj[errorName].mustNotEqual}.`;
            default:
                return `Error: ${errorName}`;
        }
    }
}
