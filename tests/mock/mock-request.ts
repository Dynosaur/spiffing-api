export class MockRequest<T = any> {

    res = new MockResponse<T>();

    constructor(public params: any = {},
                public query: any = {},
                public headers: any = {},
                public body: any = {}) { }
}

class MockResponse<T> {

    internalStatus: number;
    internalResponse: T;

    sendSpy = jest.fn();

    status(status: number): MockResponse<T> {
        this.internalStatus = status;
        return this;
    }

    send(response: T): void {
        this.sendSpy(response);
        this.internalResponse = response;
    }

}
