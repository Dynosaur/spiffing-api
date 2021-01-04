export interface BaseResponse {
    ok: boolean;
}

export interface OkResponse extends BaseResponse {
    ok: true;
}

export interface ErrorResponse<ErrorMessage extends string> extends BaseResponse {
    error: ErrorMessage;
    ok: false;
}
