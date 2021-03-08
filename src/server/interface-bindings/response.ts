import { RoutePayload } from 'route-handling/route-infra';
import { IBaseResponse, IOkResponse, IErrorResponse } from 'interface/response';

export class BaseResponse<PayloadType extends IBaseResponse> extends RoutePayload<PayloadType> {
    public payload: PayloadType = {} as PayloadType;

    constructor(public ok: boolean, message: string, code = 200) {
        super(message, {} as PayloadType, code);
        this.payload.ok = ok;
    }
}

export class OkResponse<PayloadType extends IOkResponse> extends BaseResponse<PayloadType> {
    public ok: true = true;
    public payload: PayloadType = {} as PayloadType;

    constructor(message: string, code = 200) {
        super(true, message, code);
        this.payload.ok = true;
    }
}

export class ErrorResponse<ErrorInterface extends IErrorResponse<string>> extends BaseResponse<ErrorInterface> {
    public ok: false = false;
    public payload: ErrorInterface = {} as ErrorInterface;

    constructor(public error: ErrorInterface['error'], message: string, code = 200) {
        super(false, message, code);
        this.payload.error = this.error;
        this.payload.ok = false;
    }
}
