import { RoutePayload } from 'app/server/route-handling/route-infra';
import { BaseResponse as IBaseResponse, OkResponse as IOkResponse, ErrorResponse as IErrorResponse } from 'interface/response';

export class BaseResponse {
    public payload: IBaseResponse;

    constructor(public ok: boolean) {
        this.payload = { ok: this.ok };
    }
}

export class OkResponse extends BaseResponse {
    public ok: true;
    public payload: IOkResponse;

    constructor() {
        super(true);
        this.payload = { ok: true };
    }
}

export class ErrorResponse<ErrorInterface extends IErrorResponse<string>> extends BaseResponse {
    public ok: false;
    public payload: ErrorInterface;

    constructor(public error: ErrorInterface['error'], public message: string, public eCode: number) {
        super(false);
        this.payload = {
            error: this.error,
            ok: false
        } as any;
    }

    toRoutePayload(): RoutePayload<ErrorInterface> {
        return {
            consoleMessage: this.message,
            httpCode: this.eCode,
            payload: {
                ...this.payload
            }
        };
    }
}
