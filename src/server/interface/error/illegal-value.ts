/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { RoutePayload } from 'route-handling/route-infra';

export interface IIllegalValue {
    allowed: any;
    context: string;
    error: 'Illegal Value';
    ok: false;
    value: any;
}

export class IllegalValue extends RoutePayload<IIllegalValue> {
    constructor(context: string, value: any, allowed: any) {
        super(`An illegal value was found in ${context}.`,
            { allowed, context, error: 'Illegal Value', ok: false, value }, 400);
    }
}
