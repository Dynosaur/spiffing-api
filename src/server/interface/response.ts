export interface Response {
    ok: boolean;
}

export interface SuccessfulResponse extends Response {
    ok: true;
}

export interface ErrorResponse<T> extends Response {
    ok: false;
    error: T;
}
