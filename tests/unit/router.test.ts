import { Request } from 'express';
import { RouteInfo } from 'route-handling/route-infra';
import { convertPath, pathMatches, PathSegment, registerMatch, RouteRegister } from 'server/routing';

function fakeRequest(path: string, method: string): Request {
    return {
        path,
        method,
        params: { }
    } as Request;
}

describe('routing unit', () => {
    describe('convertPath', () => {
        it('should convert paths', () => {
            expect(convertPath('/api/user/:hello')).toStrictEqual<PathSegment[]>([
                { name: 'api', type: 'path' },
                { name: 'user', type: 'path' },
                { name: 'hello', type: 'param' }
            ]);
        });
    });
    describe('pathMatches', () => {
        it('should match paths', () => {
            expect(pathMatches(convertPath('/api/user/:username'), '/api/user/hello')).toStrictEqual({
                matches: true,
                params: {
                    username: 'hello'
                }
            });
        });
    });
    describe('Register class', () => {
        let register: RouteRegister;
        let routeInfo: RouteInfo = {
            handler: function helloHandler() { return null!; },
            method: 'GET',
            path: '/api/hello'
        };
        beforeEach(() => register = new RouteRegister());
        it('should register', () => {
            register.register('/api/hello', 'GET', routeInfo);
            expect(register.isRegistered(fakeRequest('/api/hello', 'GET'))).toBe(routeInfo);
        });
        it('should throw error on duplicate handlers', () => {
            register.register('/api/test', 'GET', routeInfo);
            expect(() => register.register('/api/test', 'GET', routeInfo)).toThrowError('Handlers helloHandler and helloHandler have the same path and method.');
        });
        it('should throw an error if params are null', () => {
            expect(() => register.register(null!, 'GET', routeInfo)).toThrowError('Path must be a string: received: object');
        });
    });
    describe('registerMatch', () => {
        it('should match', () => {
            expect(registerMatch(convertPath('/api/user/:id'), '/api/user/:id')).toBe(true);
        });
        it('should not match', () => {
            expect(registerMatch(convertPath('/api/user/:id'), '/api/post/:id')).toBe(false);
        });
        it('should throw an error', () => {
            expect(() => registerMatch(convertPath('/api/user/:id'), '/api/user/:username')).toThrowError('Param Mismatch');
        });
    });
});
