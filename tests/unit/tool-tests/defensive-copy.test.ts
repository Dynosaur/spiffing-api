import { defensiveCopy } from 'tools/copy';

describe('defensiveCopy function', () => {
    it('should create an identical object that is disconnected from the original', () => {
        let original: any = { a: 'a' };
        let copy = defensiveCopy(original);
        expect(copy).toStrictEqual(original);
        copy.a = 'b';
        expect(original.a).toBe('a');

        original = 'hello';
        copy = defensiveCopy(original);
        expect(copy).toStrictEqual(original);
        copy = 'world';
        expect(original).toStrictEqual('hello');

        original = {
            status: 'ok',
            name: 'doctor',
            place: {
                state: 'Red Rock',
            }
        };
        copy = defensiveCopy(original);
        expect(copy).toStrictEqual(original);
        copy.place.state = 'Blue Rock';
        expect(original.place.state).toStrictEqual('Red Rock');
    });
    it('should copy objects with arrays as properties', () => {
        let original: any = { a: 'a', b: ['b', 'c', 'd'] };
        let copy = defensiveCopy(original);
        expect(copy).toStrictEqual(original);
        copy.b[0] = 'a';
        expect(original.b[0]).toBe('b');
    });
});
