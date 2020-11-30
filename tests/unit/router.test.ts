import { UrlPath, PathSegment, RouteRegister } from 'app/server/routing';

describe('routing unit', () => {
    describe('Path class', () => {
        it('should convert paths', () => {
                expect(UrlPath.convertPath('/hello/world')).toStrictEqual<PathSegment[]>([
                    { name: 'hello', type: 'path' },
                    { name: 'world', type: 'path' }
                ]);
                expect(UrlPath.convertPath('/1234/5678')).toStrictEqual<PathSegment[]>([
                    { name: '1234', type: 'path' },
                    { name: '5678', type: 'path' }
                ]);
                expect(UrlPath.convertPath('/alkaline-59/linterium.html')).toStrictEqual<PathSegment[]>([
                    { name: 'alkaline-59', type: 'path' },
                    { name: 'linterium.html', type: 'path' }
                ]);
                expect(UrlPath.convertPath('/api/user/:username')).toStrictEqual<PathSegment[]>([
                    { name: 'api', type: 'path' },
                    { name: 'user', type: 'path' },
                    { name: 'username', type: 'param' }
                ]);
                expect(UrlPath.convertPath('/123/456/:789')).toStrictEqual<PathSegment[]>([
                    { name: '123', type: 'path' },
                    { name: '456', type: 'path' },
                    { name: '789', type: 'param' }
                ]);
                expect(UrlPath.convertPath('/hello-world.untitled/weird_pie34/:wow_im-0')).toStrictEqual<PathSegment[]>([
                    { name: 'hello-world.untitled', type: 'path' },
                    { name: 'weird_pie34', type: 'path' },
                    { name: 'wow_im-0', type: 'param' }
                ]);
                expect(UrlPath.convertPath('/path/')).toStrictEqual<PathSegment[]>([
                    { name: 'path', type: 'path' }
                ]);
            });
        describe('doesMatch', () => {
            it('should match', () => {
                let path = new UrlPath('/path/path/:param');
                expect(path.doesMatch('/path/path/param')).toBe(true);
                expect(path.doesMatch('/path/path/some-param')).toBe(true);
                expect(path.doesMatch('/path/path/parameter123')).toBe(true);
                expect(path.doesMatch('/path/path/param/')).toBe(true);
                path = new UrlPath('/path/');
                expect(path.doesMatch('/path/')).toBe(true);
                expect(path.doesMatch('/path')).toBe(true);
            });
            it('should not match', () => {
                let path = new UrlPath('/path/path/:param');
                expect(path.doesMatch('/path/other-path/param')).toBe(false);
                expect(path.doesMatch('/path/other-path/some-param')).toBe(false);
                expect(path.doesMatch('/123/path/parameter123')).toBe(false);
                expect(path.doesMatch('/path')).toBe(false);
            });
        });
    });
    describe('Register class', () => {
        it('should register', () => {
            const reg = new RouteRegister();
            reg.register('/path', 'GET');
            expect(reg.registered).toMatchObject([{
                methods: ['GET'],
                path: expect.objectContaining({
                    segments: [ { name: 'path', type: 'path' } ]
                })
            }]);
            reg.register('/path', 'POST');
            expect(reg.registered).toMatchObject([{
                methods: ['GET', 'POST'],
                path: expect.objectContaining({
                    segments: [{ name: 'path', type: 'path' }]
                })
            }]);
            reg.register('/path', 'GET');
            expect(reg.registered).toMatchObject([{
                methods: ['GET', 'POST'],
                path: expect.objectContaining({
                    segments: [{ name: 'path', type: 'path' }]
                })
            }]);
            reg.register('/path/:param', 'POST');
            expect(reg.registered).toMatchObject([
                {
                    methods: ['GET', 'POST'],
                    path: expect.objectContaining({
                        segments: [{ name: 'path', type: 'path' }]
                    })
                }, {
                    methods: ['POST'],
                    path: expect.objectContaining({
                        segments: [{ name: 'path', type: 'path' }, { name: 'param', type: 'param' }]
                    })
                }
            ]);
        });
    });
});
