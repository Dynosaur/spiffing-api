import { requireObjectKeys } from 'tests/mock/database/mock-collection';

describe('doesSubjectContainModelProps function', () => {
    it('should match primitives', () => {
        expect(requireObjectKeys('hello', 'hello')).toBe(true);
        expect(requireObjectKeys('hello', 'world')).toBe(false);
        expect(requireObjectKeys(1, 1)).toBe(true);
        expect(requireObjectKeys(1, 0)).toBe(false);
    });
    it('should match objects', () => {
        expect(requireObjectKeys({ }, { })).toBe(true);
        expect(requireObjectKeys({ }, { a: 'a' })).toBe(true);
        expect(requireObjectKeys({ a: 'a', b: 'b' }, { a: 'a', b: 'b', c: 'c', d: 'd' })).toBe(true);
        expect(requireObjectKeys(
            { a: 'a' },
            { a: 'a', b: 'b', c: { d: { e: 'e', f: { g: 'g' } } }, h: { i: 'i' } })).toBe(true);
    });
    it('should match arrays', () => {
        expect(requireObjectKeys([], [])).toBe(true);
        expect(requireObjectKeys([1, 2, 'string'], [1, 2, 'string'])).toBe(true);
        expect(requireObjectKeys([1, 2, 'string'], [1, 2, 3])).toBe(false);
    });
    it('should not match only if the subject is missing the property', () => {
        expect(requireObjectKeys([1, 2, 'string'], [1, 2, 'string', 4, 5, 6])).toBe(true);
        expect(requireObjectKeys([1, 2, 3], [1, 2, 3, 4, 5, 6])).toBe(true);
        expect(requireObjectKeys({ a: { b: 'b' } }, { a: { b: 'b', c: 100, d: ['hello', 'world'], e: 'e' } })).toBe(true);
        expect(requireObjectKeys({ a: { b: 'b' } }, { a: { c: 100, d: ['hello', 'world'], e: 'e' } })).toBe(false);

    });
});
