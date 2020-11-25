import { checkScope } from '../../src/server/route-handling/check-scope';

const missingDataError = {
    payload: {
        error: 'Missing Requirements',
        ok: false,
    }
};

describe('checkScope', () => {
    describe('single param', () => {
        it('should not return anything when fulfilled', () => {
            expect(checkScope('required', {}, { required: 'present' }, 'obj')).toBeNull();
            expect(checkScope('a', {}, { a: 'a', b: 'b', c: 'c' }, 'obj')).toBeNull();
            expect(checkScope('b', {}, { a: { num: 1 }, b: { } }, 'obj')).toBeNull();
        });
        it('should return a missing data payload when unfulfilled', () => {
            expect(checkScope('required', {}, { random: 299 }, 'obj')).toMatchObject(missingDataError);
            expect(checkScope('a', {}, { b: 'b', c: 'c' }, 'obj')).toMatchObject(missingDataError);
            expect(checkScope('b', {}, { a: { num: 1 } }, 'obj')).toMatchObject(missingDataError);
        });
        it('should replace', () => {
            const object: any = {
                a: 'a',
                b: 'b',
                c: 'c'
            };
            expect(checkScope('a', { required: true }, object, 'obj')).toBeNull();
            expect(object.required).toBe(true);
        });
    });
    describe('multiple params', () => {
        it('should not return anything when fulfilled', () => {
            expect(checkScope(['required', 'alsoRequired'], {}, { required: 'present', alsoRequired: 'present' }, 'obj')).toBeNull();
            expect(checkScope(['a', 'b', 'c'], {}, { a: 'a', b: 'b', c: 'c' }, 'obj')).toBeNull();
            expect(checkScope(['a', 'b'], {}, { a: { num: 1 }, b: { } }, 'obj')).toBeNull();
        });
        it('should return a missing data payload when unfulfilled', () => {
            expect(checkScope(['required', 'alsoRequired'], {}, { random: 299 }, 'obj')).toMatchObject(missingDataError);
            expect(checkScope(['required', 'alsoRequired'], {}, { required: 'present' }, 'obj')).toMatchObject(missingDataError);
        });
        it('should replace', () => {
            const object: any = {
                a: 'a',
                b: 'b',
                c: 'c'
            };
            expect(checkScope(['a', 'b', 'c'], { required: true }, object, 'obj')).toBeNull();
            expect(object.required).toBe(true);
        });
    });
    describe('2d params', () => {
        it('should not return anything when fulfilled', () => {
            expect(
                checkScope([ ['a', 'b'], ['d'] ], {}, { a: 'a', b: 'b' }, 'obj')
            ).toBeNull();
            expect(
                checkScope([ ['a', 'b'], ['d'] ], {}, { d: 'd' }, 'obj')
            ).toBeNull();
            expect(
                checkScope([ ['a', 'b'], ['d'] ], {}, { a: 'a', d: 'd' }, 'obj')
            ).toBeNull();
            expect(
                checkScope([ ['username'], ['password'] ], {}, { username: 'hello' }, 'obj')
            ).toBeNull();
            expect(
                checkScope([ ['username'], ['password'] ], {}, { password: 'world' }, 'obj')
            ).toBeNull();
        });
        it('should return a missing data payload when unfulfilled', () => {
            expect(
                checkScope([ ['a', 'b'], ['d'] ], {}, { c: 'c' }, 'obj')
            ).toMatchObject(missingDataError);
            expect(
                checkScope([ ['a', 'b'], ['d'] ], {}, { a: 'a' }, 'obj')
            ).toMatchObject(missingDataError);
        });
        it('should replace', () => {
            const object: any = {
                username: 'random-username'
            };
            expect(
                checkScope( [ ['username'], ['password'] ], { test: false }, object, 'obj')
            ).toBeNull();
            expect(object.test).toBe(false);
        });
    });
});
