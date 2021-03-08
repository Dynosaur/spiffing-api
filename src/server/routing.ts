/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request }    from 'express';
import { HttpMethod } from 'server/server';
import {
    getNameOfRouteInfo,
    isHandlerRoute,
    RouteInfo
} from 'route-handling/route-infra';

export interface PathSegment {
    name: string;
    type: 'path' | 'param';
}

export function convertPath(path: string): PathSegment[] {
    const nodes = path.match(/\/[^/]+/g) || [];
    const assigned: PathSegment[] = [];
    for (const node of nodes) {
        if (node.startsWith('/:')) {
            assigned.push({
                name: /:([^/]+)/.exec(node)![1],
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

export function pathMatches(fit: PathSegment[], path: string): { matches: false; } | { matches: true; params: Record<string, string>; } {
    const nodes = path.match(/\/([^/]+)/g) || [];
    if (fit.length !== nodes.length) return { matches: false };
    const params: Record<string, string> = {};
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

interface RegisteredRoute {
    path: PathSegment[];
    methods: Map<HttpMethod, RouteInfo>;
}

export class RouteRegister {
    paths: RegisteredRoute[] = [];

    register(path: string, method: HttpMethod, info: RouteInfo): void {
        if (path === undefined || path === null ) throw new Error(`Path must be a string: received: ${typeof path}`);
        const handlerName = isHandlerRoute(info) ? info.handler.name : info.streamHandler.name;
        for (const registeredPath of this.paths) {
            let pathsMatch: boolean;
            try {
                pathsMatch = registerMatch(registeredPath.path, path);
            } catch (error) {
                if (error instanceof ParamMismatch) {
                    const existingHandlers: string[] = [];
                    registeredPath.methods.forEach(rInfo =>
                        existingHandlers.push(`${rInfo.method}  ${rInfo.path} => ` +
                        `${isHandlerRoute(rInfo) ? rInfo.handler.name : rInfo.streamHandler.name}`)
                    );
                    const pathSegments = registeredPath.path.map(p => (p.type === 'path') ? p.name : ':' + p.name);
                    const existingPath = '/' + pathSegments.join('/');
                    throw new Error(
                        `handler "${handlerName}" has a different path param name than others of the same path: ${error.attempted}\n` +
                        `standard path: ${existingPath}\n` +
                        `attempted path: ${info.path}\n\t` +
                            'existing handlers:\n\t\t' +
                                `${existingHandlers.join('\n\t\t')}\n\t` +
                            `malformed handler: ${method} => ${handlerName}`
                    );
                } else throw error;
            }
            if (pathsMatch)
                if (registeredPath.methods.has(method)) {
                    const offenderName = getNameOfRouteInfo(registeredPath.methods.get(method)!);
                    throw new Error(`Handlers ${offenderName} and ${handlerName} have the same path and method.`);
                } else {
                    registeredPath.methods.set(method, info);
                    return;
                }
        }
        this.paths.push({
            path: convertPath(path),
            methods: new Map<HttpMethod, RouteInfo>().set(method, info)
        });
    }

    isRegistered(request: Request): RouteInfo | null {
        const method = <HttpMethod> request.method;
        for (const registeredPath of this.paths) {
            const result = pathMatches(registeredPath.path, request.path);
            if (result.matches)
                if (registeredPath.methods.has(method)) {
                    Object.assign(request.params, result.params);
                    return registeredPath.methods.get(method)!;
                }
                else return null;
        }
        return null;
    }

}
