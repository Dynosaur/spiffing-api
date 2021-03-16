import { RoutePayload } from 'route-handling/route-infra';

export interface IObjectIdParse {
    context: string;
    error: 'Object Id Parse';
    ok: false;
    provided: string;
}

export class ObjectIdParse implements RoutePayload<IObjectIdParse> {
    code = 400;
    message: string;
    payload = {
        context: '',
        error: 'Object Id Parse' as const,
        ok: false as const,
        provided: ''
    };

    constructor(context: string, provided: string) {
        this.message = `Could not parse ${context}: ${provided}.`;
        this.payload.context = context;
        this.payload.provided = provided;
    }
}
