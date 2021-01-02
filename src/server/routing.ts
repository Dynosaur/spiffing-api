import { Request } from 'express';
import { RouteInfo } from './route-handling/route-infra';

export interface PathSegment {
    name: string;
    type: 'path' | 'param';
}

export function convertPath(path: string): PathSegment[] {
    const nodes = path.match(/\/[^\/]+/g) || [];
    const assigned: PathSegment[] = [];
    for (const node of nodes) {
        if (node.startsWith('/:')) {
            assigned.push({
                name: /:([^\/]+)/.exec(node)[1],
                type: 'param'
            });
        } else {
            assigned.push({
                name: node.substring(1),
                type: 'path'
            });
        }
    }
    return assigned;
}

export function pathMatches(fit: PathSegment[], path: string): { matches: false; } | { matches: true; params: object; } {
    const nodes = path.match(/\/([^\/]+)/g) || [];
    if (fit.length !== nodes.length) return { matches: false };
    const params: object = {};
    for (let i = 0; i < fit.length; i++)
        if (fit[i].type === 'path') {
            if (fit[i].name !== nodes[i].substring(1))
                return { matches: false };
        } else params[fit[i].name] = nodes[i].substring(1);
    return {
        matches: true,
        params
    };
}

class ParamMismatch extends Error {
    constructor(public existing: string, public attempted: string) {
        super('Param Mismatch');
    }
}

export function registerMatch(fit: PathSegment[], path: string): boolean {
    const nodes = convertPath(path);
    if (fit.length !== nodes.length) return false;
    for (let i = 0; i < fit.length; i++) {
        const f = fit[i];
        const node = nodes[i];
        if (f.type === 'path') {
            if (node.type !== 'path') return false;
            if (node.name !== f.name) return false;
        } else {
            if (node.type !== 'param') return false;
            if (node.name !== f.name) throw new ParamMismatch(f.name, node.name);
        }
    }
    return true;
}

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

interface RegisteredRoute {
    path: PathSegment[];
    methods: Map<HttpMethod, RouteInfo>;
}

export class RouteRegister {
    paths: RegisteredRoute[] = [];

    register(path: string, method: HttpMethod, info: RouteInfo): void {
        if (path === undefined || path === null ) throw new Error(`Path must be a string: received: ${typeof path}`);
        for (const registeredPath of this.paths) {
            let pathsMatch: boolean;
            try {
                pathsMatch = registerMatch(registeredPath.path, path);
            } catch (error) {
                if (error instanceof ParamMismatch) {
                    const existingHandlers: string[] = [];
                    registeredPath.methods.forEach(rInfo => existingHandlers.push(`${rInfo.method}  ${rInfo.path} => ${rInfo.handler.name}`));
                    const existingPath = '/' + registeredPath.path.map(p => (p.type === 'path') ? p.name : ':' + p.name).join('/');
                    throw new Error(`handler "${info.handler.name}" has a different path param name than others of the same path: ${error.attempted}\n
                                     \nstandard path: ${existingPath}
                                     \nattempted path: ${info.path}
                                     \texisting handlers:\n\t${existingHandlers.join('\n\t')}
                                     \tmalformed handler: ${method} => ${info.handler.name}`);
                } else throw error;
            }
            if (pathsMatch)
                if (registeredPath.methods.has(method))
                    throw new Error(`Handlers ${registeredPath.methods.get(method).handler.name} and ${info.handler.name} have the same path and method.`);
                else {
                    registeredPath.methods.set(method, info);
                    return;
                }
        }
        this.paths.push({
            path: convertPath(path),
            methods: new Map<HttpMethod, RouteInfo>().set(method, info)
        });
    }

    isRegistered(request: Request): RouteInfo {
        const method = <HttpMethod> request.method;
        for (const registeredPath of this.paths) {
            const result = pathMatches(registeredPath.path, request.path);
            if (result.matches)
                if (registeredPath.methods.has(method)) {
                    Object.assign(request.params, result.params);
                    return registeredPath.methods.get(method);
                }
                else return null;
        }
        return null;
    }

}
