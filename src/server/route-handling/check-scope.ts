import { missingData } from './response-functions';
import { RoutePayload } from './route-infra';
import { MissingDataErrorResponse } from '../interface/responses/error-responses';

function keyCheck(keys: string[], object: object): string[] {
    const missing: string[] = [];
    keys.forEach(key => {
        if (object[key] === undefined || object[key] === null) {
            missing.push(key);
        }
    });
    return missing;
}

function replaceObject(replace: object, object: object): object {
    Object.keys(replace).forEach(key => {
        if (!object[key]) {
            object[key] = replace[key];
        }
    });
    return object;
}

export function checkScope(required: string, replace: object, scope: object, name: string): RoutePayload<MissingDataErrorResponse>;
export function checkScope(required: string[], replace: object, scope: object, name: string): RoutePayload<MissingDataErrorResponse>;
export function checkScope(required: string[][], replace: object, scope: object, name: string): RoutePayload<MissingDataErrorResponse>;
export function checkScope(required: string | string[] | string[][], replace: object, scope: object, name: string): RoutePayload<MissingDataErrorResponse>;
export function checkScope(required: string | string[] | string[][], replace: object, scope: object, name: string): RoutePayload<MissingDataErrorResponse> {
    if (required instanceof Array) {
        if (required[0] instanceof Array) {
            required = required as string[][];

            for (const path of required) {
                const missing = keyCheck(path, scope);
                if (!missing.length) {
                    replaceObject(replace, scope);
                    return null;
                }
            }
            return missingData(required, scope, name);
        } else {
            required = required as string[];

            const missing = keyCheck(required, scope);
            if (missing.length) {
                return missingData([required], scope, name);
            } else {
                replaceObject(replace, scope);
                return null;
            }
        }
    } else {
        const missing = keyCheck([required], scope);
        if (missing.length) {
            return missingData([[required]], scope, name);
        } else {
            replaceObject(replace, scope);
            return null;
        }
    }
}
