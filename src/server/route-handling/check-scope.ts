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

// export function checkScope(
//     check: RequiredParam | RequiredParam[] | RequiredParam[][],
//     scope: any,
//     name: string,
//     require: ScopeStrategy = 'all'
// ): RoutePayload<MissingDataErrorResponse> {
//     if (!scope || Object.keys(scope).length === 0) {
//         chalk.orange(`WARNING: request "${name}" is undefined or empty!`);
//     }

//     if (check instanceof Array) {
//         if (check[0] instanceof Array) {
//             check.forEach(option => {
//                 option.forEach
//             });
//         }
//     }

//     const andMap = new Map<string, boolean>();
//     const orMap = new Map<string, boolean>();
//     const missingAnd: string[] = [];
//     const missingOr: string[] = [];
//     check.forEach(param => {
//         if (!param.strategy) {
//             param.strategy = 'AND';
//         }
//         const key = param.param;
//         switch (param.strategy) {
//             case 'AND':
//                 if (!scope[key]) {
//                     missingAnd.push(key);
//                 }
//                 andMap.set(key, scope[key]);
//                 break;
//             case 'OR':
//                 if (!scope[key]) {
//                     missingOr.push(key);
//                 }
//                 orMap.set(key, scope[key]);
//                 break;
//             case 'REPLACE':
//                 if (!scope[key]) {
//                     scope[key] = param.replacement;
//                 }
//         }
//     });

//     if (missingAnd.length) {
//         return missingData(missingAnd, name, 'all');
//     } else {
//         if (missingOr.length === orMap.size) {
//             return missingData()
//         }
//     }

//     // if (require === 'all') {
//     //     const missing: string[] = [];
//     //     for (const param of params) {
//     //         if (!scope[param]) {
//     //             missing.push(param);
//     //         }
//     //     }
//     //     if (missing.length) {
//     //         return missingData(missing, name, 'all');
//     //     } else {
//     //         return null;
//     //     }
//     // } else {
//     //     for (const param of params) {
//     //         if (scope[param]) {
//     //             return null;
//     //         }
//     //     }
//     //     return missingData(params, name, 'one');
//     // }
// }
