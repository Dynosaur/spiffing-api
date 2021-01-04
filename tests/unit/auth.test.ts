import { AuthorizationParseError } from 'app/server/interface-bindings/error-responses';
import { decodeBasicAuth, decodeHttp, encodeBasicAuth, encodeHttp } from '../../src/tools/auth';

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
        expect(() => new Promise(resolve => decodeBasicAuth(resolve, 'Basic aGVsbG86d29ybGQ='))).toStrictEqual({
            username: 'hello',
            password: 'world'
        });
        expect(() => new Promise(resolve => decodeBasicAuth(resolve, 'Basic ZGlmZmljdWx0JTIwdG8lM0FQYXJzZTpJJTIwSEFURSUzQVBBU1NXT1JEUyUyMCUyMA=='))).toStrictEqual({
            username: 'difficult to:Parse',
            password: 'I HATE:PASSWORDS  '
        });
        expect(() => new Promise(resolve => decodeBasicAuth(resolve, 'Basic JTNBJTNBTWFrZSUyMGluZyUyMCUzQSUzQUlUJTNBRElGRklDVUxUJTIwJTIwJTNBJTNBJTNBOiUzQSUzQUxPTCUyMCUyMA=='))).toStrictEqual({
            username: '::Make ing ::IT:DIFFICULT  :::',
            password: '::LOL  '
        });

        expect(() => new Promise(resolve => decodeBasicAuth(resolve, ''))).toStrictEqual(new AuthorizationParseError('Authorization Type'));
        expect(() => new Promise(resolve => decodeBasicAuth(resolve, 'Basic '))).toStrictEqual(new AuthorizationParseError('Username'));
        expect(() => new Promise(resolve => decodeBasicAuth(resolve, 'Basic dXNlcm5hbWU6'))).toStrictEqual(new AuthorizationParseError('Password'));
    });

    it('encodeBasicAuth', () => {
        expect(encodeBasicAuth('hello', 'world')).toBe('Basic aGVsbG86d29ybGQ=');
        expect(encodeBasicAuth('', '')).toBe('Basic Og==');
    });

});
