export interface IBaseResponse {
    ok: boolean;
}

export interface IOkResponse extends IBaseResponse {
    ok: true;
}

export interface IErrorResponse<ErrorMessage extends string> extends IBaseResponse {
    error: ErrorMessage;
    ok: false;
}
