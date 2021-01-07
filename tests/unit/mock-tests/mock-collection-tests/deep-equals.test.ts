import { deepEquals } from 'tests/mock/database/mock-collection';

describe('deepEquals function', () => {
    it('should match strings', () => {
        expect(deepEquals('', '')).toBe(true);
        expect(deepEquals('hello', 'hello')).toBe(true);
        expect(deepEquals('hello', 'world')).toBe(false);
    });
    it('should match numbers', () => {
        expect(deepEquals(1, 1)).toBe(true);
        expect(deepEquals(1, 0)).toBe(false);
        expect(deepEquals(10519435, 10519435)).toBe(true);
        expect(deepEquals(10519435, -10519435)).toBe(false);
    });
    it('should match objects', () => {
        expect(deepEquals({ }, { })).toBe(true);
        expect(deepEquals({ }, { a: 'a' })).toBe(false);
        expect(deepEquals({ a: 'a', b: 'b' }, { a: 'a', b: 'b' })).toBe(true);
        expect(deepEquals(
            { a: 'a', b: 'b', c: { d: { e: 'e', f: { g: 'g' } } }, h: { i: 'i' } },
            { a: 'a', b: 'b', c: { d: { e: 'e', f: { g: 'g' } } }, h: { i: 'i' } })).toBe(true);
    });
    it('should match arrays', () => {
        expect(deepEquals([], [])).toBe(true);
        expect(deepEquals([1, 2, 'string'], [1, 2, 'string'])).toBe(true);
        expect(deepEquals([1, 2, 'string'], [1, 2, 3])).toBe(false);
    });
});
