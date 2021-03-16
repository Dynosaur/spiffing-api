import { decodeBasicAuth, decodeHttp, encodeBasicAuth, encodeHttp } from 'tools/auth';
import { AuthorizationParse } from 'interface/error/authorization-parse';

describe('auth tools', () => {
    it('decodeHttp', () => {
        expect(decodeHttp('hello%3Aworld')).toBe('hello:world');
        expect(decodeHttp('hello%20world')).toBe('hello world');
        expect(decodeHttp('%3A%20%20%20hello%3A%3Aworld%3A%20')).toBe(':   hello::world: ');
        expect(decodeHttp('%3A%3A%3A%3A%3A')).toBe(':::::');
        expect(decodeHttp('%20%20%20%20%20')).toBe('     ');
    });
    it('encodeHttp', () => {
        expect(encodeHttp('hello:world')).toBe('hello%3Aworld');
        expect(encodeHttp('hello world')).toBe('hello%20world');
        expect(encodeHttp(':   hello::world: ')).toBe('%3A%20%20%20hello%3A%3Aworld%3A%20');
        expect(encodeHttp(':::::')).toBe('%3A%3A%3A%3A%3A');
        expect(encodeHttp('     ')).toBe('%20%20%20%20%20');
    });
    it('encodeHttp + decodeHttp', () => {
        expect(decodeHttp(encodeHttp('hello:world'))).toBe('hello:world');
        expect(decodeHttp(encodeHttp('hello world'))).toBe('hello world');

        expect(encodeHttp(decodeHttp('hello%20world'))).toBe('hello%20world');
        expect(encodeHttp(decodeHttp('%3A%20%20%20hello%3A%3Aworld%3A%20'))).toBe('%3A%20%20%20hello%3A%3Aworld%3A%20');
    });
    it('decodeBasicAuth', () => {
        expect(decodeBasicAuth('Basic aGVsbG86d29ybGQ=')).toStrictEqual({
            ok: true,
            password: 'world',
            username: 'hello'
        });
        expect(decodeBasicAuth('Basic ZGlmZmljdWx0JTIwdG8lM0FQYXJzZTpJJTIwSEFURSUzQVBBU1NXT1JEUyUyMCUyMA==')).toStrictEqual({
            ok: true,
            password: 'I HATE:PASSWORDS  ',
            username: 'difficult to:Parse'
        });
        expect(decodeBasicAuth('Basic JTNBJTNBTWFrZSUyMGluZyUyMCUzQSUzQUlUJTNBRElGRklDVUxUJTIwJTIwJTNBJTNBJTNBOiUzQSUzQUxPTCUyMCUyMA==')).toStrictEqual({
            ok: true,
            password: '::LOL  ',
            username: '::Make ing ::IT:DIFFICULT  :::'
        });
        expect(decodeBasicAuth('')).toStrictEqual({
            error: new AuthorizationParse('Authorization Type'),
            ok: false
        });
        expect(decodeBasicAuth('Basic ')).toStrictEqual({
            error: new AuthorizationParse('Username'),
            ok: false
        });
        expect(decodeBasicAuth('Basic dXNlcm5hbWU6')).toStrictEqual({
            error: new AuthorizationParse('Password'),
            ok: false
        });
    });
    it('encodeBasicAuth', () => {
        expect(encodeBasicAuth('hello', 'world')).toBe('Basic aGVsbG86d29ybGQ=');
        expect(encodeBasicAuth('', '')).toBe('Basic Og==');
    });
});
