import { RoutePayload } from 'route-handling/route-infra';

export interface IMissing {
    allowedValues?: string[];
    error: 'Missing Item';
    field: string;
    name: string;
    ok: false;
}

export class Missing extends RoutePayload<IMissing> {
    constructor(field: string, name: string, allowedValues?: string[]) {
        super(`Request was missing ${name} field in request ${field}.`,
            { error: 'Missing Item', field, name, ok: false }, 400);
        if (allowedValues !== undefined && allowedValues.length > 0)
            this.payload.allowedValues = allowedValues;
    }
}
