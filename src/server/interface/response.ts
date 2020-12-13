export interface BaseResponse {
    ok: boolean;
}

export interface OkResponse extends BaseResponse {
    ok: true;
}

export interface ErrorResponse<T> extends BaseResponse {
    error: T;
    ok: false;
}
