import { IBaseResponse as IBaseResponse, IOkResponse as IOkResponse, IErrorResponse as IErrorResponse } from 'interface/response';

export class BaseResponse<PayloadType extends IBaseResponse> {
    public payload: PayloadType;

    constructor(public ok: boolean, public message: string, public code = 200) {
        this.payload.ok = this.ok;
    }
}

export class OkResponse<PayloadType extends IOkResponse> extends BaseResponse<PayloadType> {
    public ok: true;
    public payload: PayloadType;

    constructor(message: string, code = 200) {
        super(true, message, code);
        this.payload.ok = true;
    }
}

export class ErrorResponse<ErrorInterface extends IErrorResponse<string>> extends BaseResponse<ErrorInterface> {
    public ok: false;
    public payload: ErrorInterface;

    constructor(public error: ErrorInterface['error'], message: string, code = 200) {
        super(false, message, code);
        this.payload.error = this.error;
        this.payload.ok = false;
    }
}
