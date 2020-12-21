import { parsingError } from '../../src/server/route-handling/response-functions';
import { decodeBasicAuth, decodeHttp, DecodeResult, encodeBasicAuth, encodeHttp } from '../../src/tools/auth';

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
        expect(decodeBasicAuth('Basic aGVsbG86d29ybGQ=')).toStrictEqual<DecodeResult>({
            ok: true,
            username: 'hello',
            password: 'world'
        });
        expect(decodeBasicAuth('Basic ZGlmZmljdWx0JTIwdG8lM0FQYXJzZTpJJTIwSEFURSUzQVBBU1NXT1JEUyUyMCUyMA==')).toStrictEqual<DecodeResult>({
            ok: true,
            username: 'difficult to:Parse',
            password: 'I HATE:PASSWORDS  '
        });
        expect(decodeBasicAuth('Basic JTNBJTNBTWFrZSUyMGluZyUyMCUzQSUzQUlUJTNBRElGRklDVUxUJTIwJTIwJTNBJTNBJTNBOiUzQSUzQUxPTCUyMCUyMA==')).toStrictEqual<DecodeResult>({
            ok: true,
            username: '::Make ing ::IT:DIFFICULT  :::',
            password: '::LOL  '
        });

        expect(decodeBasicAuth('')).toStrictEqual<DecodeResult>({
            ok: false,
            error: parsingError('type')
        });
        expect(decodeBasicAuth('Basic ')).toStrictEqual<DecodeResult>({
            ok: false,
            error: parsingError('username')
        });
        expect(decodeBasicAuth('Basic dXNlcm5hbWU6')).toStrictEqual<DecodeResult>({
            ok: false,
            error: parsingError('password')
        });
    });

    it('encodeBasicAuth', () => {
        expect(encodeBasicAuth('hello', 'world')).toBe('Basic aGVsbG86d29ybGQ=');
        expect(encodeBasicAuth('', '')).toBe('Basic Og==');
    });

});
