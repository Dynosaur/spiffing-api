export class MockCursor {

    constructor(public internalArray: any[]) { }

    async forEach(fn): Promise<void> {
        this.internalArray.forEach(fn);
    }
}
