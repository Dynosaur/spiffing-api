import { couldNotParseRequest } from '../../src/server/route-handling/response-functions';
import { decodeBasicAuth, decodeHttp, DecodeResult, encodeBasicAuth, encodeHttp } from '../../src/tools/auth';

describe('auth tools', () => {

    test('decodeHttp', () => {
        expect(decodeHttp('hello%3Aworld')).toBe('hello:world');
        expect(decodeHttp('hello%20world')).toBe('hello world');
        expect(decodeHttp('%3A%20%20%20hello%3A%3Aworld%3A%20')).toBe(':   hello::world: ');
        expect(decodeHttp('%3A%3A%3A%3A%3A')).toBe(':::::');
        expect(decodeHttp('%20%20%20%20%20')).toBe('     ');
    });

    test('encodeHttp', () => {
        expect(encodeHttp('hello:world')).toBe('hello%3Aworld');
        expect(encodeHttp('hello world')).toBe('hello%20world');
        expect(encodeHttp(':   hello::world: ')).toBe('%3A%20%20%20hello%3A%3Aworld%3A%20');
        expect(encodeHttp(':::::')).toBe('%3A%3A%3A%3A%3A');
        expect(encodeHttp('     ')).toBe('%20%20%20%20%20');
    });

    test('encodeHttp + decodeHttp', () => {
        expect(decodeHttp(encodeHttp('hello:world'))).toBe('hello:world');
        expect(decodeHttp(encodeHttp('hello world'))).toBe('hello world');

        expect(encodeHttp(decodeHttp('hello%20world'))).toBe('hello%20world');
        expect(encodeHttp(decodeHttp('%3A%20%20%20hello%3A%3Aworld%3A%20'))).toBe('%3A%20%20%20hello%3A%3Aworld%3A%20');
    });

    test('decodeBasicAuth', () => {
        expect(decodeBasicAuth('Basic aGVsbG86d29ybGQ=')).toStrictEqual<DecodeResult>({
            status: 'ok',
            username: 'hello',
            password: 'world'
        });
        expect(decodeBasicAuth('Basic ZGlmZmljdWx0JTIwdG8lM0FQYXJzZTpJJTIwSEFURSUzQVBBU1NXT1JEUyUyMCUyMA==')).toStrictEqual<DecodeResult>({
            status: 'ok',
            username: 'difficult to:Parse',
            password: 'I HATE:PASSWORDS  '
        });
        expect(decodeBasicAuth('Basic JTNBJTNBTWFrZSUyMGluZyUyMCUzQSUzQUlUJTNBRElGRklDVUxUJTIwJTIwJTNBJTNBJTNBOiUzQSUzQUxPTCUyMCUyMA==')).toStrictEqual<DecodeResult>({
            status: 'ok',
            username: '::Make ing ::IT:DIFFICULT  :::',
            password: '::LOL  '
        });

        expect(decodeBasicAuth('')).toStrictEqual<DecodeResult>({
            status: 'error',
            error: couldNotParseRequest('type')
        });
        expect(decodeBasicAuth('Basic ')).toStrictEqual<DecodeResult>({
            status: 'error',
            error: couldNotParseRequest('username')
        });
        expect(decodeBasicAuth('Basic dXNlcm5hbWU6')).toStrictEqual<DecodeResult>({
            status: 'error',
            error: couldNotParseRequest('password')
        });
    });

    test('encodeBasicAuth', () => {
        expect(encodeBasicAuth('hello', 'world')).toBe('Basic aGVsbG86d29ybGQ=');
        expect(encodeBasicAuth('', '')).toBe('Basic Og==');
    });

});
