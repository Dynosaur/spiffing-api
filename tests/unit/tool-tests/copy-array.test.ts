import { copyArray } from 'tools/copy';

describe('copyArray function', () => {
    it('should copy an array of primitives', () => {
        let original: any[] = [1, 2, 3, 4, 5];
        let copy = copyArray(original);
        expect(copy).toStrictEqual(original);
        copy[0] = 6;
        expect(original[0]).toBe(1);

        original = ['red', 'green', 'blue'];
        copy = copyArray(original);
        expect(copy).toStrictEqual(original);
        copy[0] = 'yellow';
        expect(original[0]).toBe('red');
    });
    it('should copy an array of objects', () => {
        let original: any[] = [{ a: 'a' }, { b: 'b' }, { c: 'c' }];
        let copy = copyArray(original);
        expect(copy).toStrictEqual(original);
        copy[0].a = 'd';
        expect(original[0].a).toBe('a');
    });
});
