import { RoutePayload } from 'route-handling/route-infra';
import { IBaseResponse as IBaseResponse, IOkResponse as IOkResponse, IErrorResponse as IErrorResponse } from 'interface/response';

export class BaseResponse<PayloadType extends IBaseResponse> extends RoutePayload<PayloadType> {
    public payload: PayloadType;

    constructor(public ok: boolean, message: string, code = 200) {
        super(message, {} as any, code);
        this.payload.ok = ok;
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
