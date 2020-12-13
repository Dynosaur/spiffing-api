export class MockCursor<T> {

    constructor(public _data: T[]) { }

    async forEach(fn: (item: T) => void): Promise<void> {
        this._data.forEach(fn);
    }
}
