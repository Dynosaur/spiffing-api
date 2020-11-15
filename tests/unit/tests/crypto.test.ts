import { Cipher } from '../../../src/tools';

describe('crypto', () => {
    describe('Cipher class', () => {
        it('should accept a key if it is 32 bytes long', () => {
            expect(() => new Cipher(Buffer.alloc(32))).not.toThrow();
        });
        it('should not accept a key if it is not 32 bytes long', () => {
            expect(() => new Cipher(Buffer.alloc(16))).toThrow();
        });
        describe('interlace', () => {
            describe('secret-first', () => {
                it('should correctly interlace a string', () => {
                    let interlaced = Cipher.interlace(Buffer.from('00112233', 'hex'), Buffer.from('aabbccdd', 'hex'), 'secret-first');
                    expect(interlaced.toString('hex')).toBe('00040400112233aabbccdd');
                    interlaced = Cipher.interlace(Buffer.from('00112233', 'hex'), Buffer.from('aabb', 'hex'), 'secret-first');
                    expect(interlaced.toString('hex')).toBe('00040200112233aabb');
                    interlaced = Cipher.interlace(Buffer.from('0011', 'hex'), Buffer.from('aabbccdd', 'hex'), 'secret-first');
                    expect(interlaced.toString('hex')).toBe('0002040011aabbccdd');
                });
            });
            describe('secret-interlaced', () => {
                it('should interlace when secret and vector are the same length', () => {
                    let interlaced = Cipher.interlace(Buffer.from('00112233', 'hex'), Buffer.from('aabbccdd', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02040400aa11bb22cc33dd');
                    interlaced = Cipher.interlace(Buffer.from('abcd', 'hex'), Buffer.from('5678', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('020202ab56cd78');
                    interlaced = Cipher.interlace(Buffer.from('00112233445566778899aabbccddeeff', 'hex'), Buffer.from('ffeeddccbbaa99887766554433221100', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02101000ff11ee22dd33cc44bb55aa6699778888779966aa55bb44cc33dd22ee11ff00');
                });
                it('should interlace when secret is longer', () => {
                    let interlaced = Cipher.interlace(Buffer.from('1122', 'hex'), Buffer.from('aa', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('0202011122aa');
                    interlaced = Cipher.interlace(Buffer.from('00112233', 'hex'), Buffer.from('aabb', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('0204020011aa2233bb');
                    interlaced = Cipher.interlace(Buffer.from('0011223344556677', 'hex'), Buffer.from('aabb', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02080200112233aa44556677bb');
                    interlaced = Cipher.interlace(Buffer.from('00112233445566778899aabbccddeeff', 'hex'), Buffer.from('aabbccdd', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02100400112233aa44556677bb8899aabbccccddeeffdd');
                });
                it('should interlace when vector is longer', () => {
                    let interlaced = Cipher.interlace(Buffer.from('11', 'hex'), Buffer.from('aabb', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02010211aabb');
                    interlaced = Cipher.interlace(Buffer.from('0011', 'hex'), Buffer.from('aabbccdd', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02020400aabb11ccdd');
                    interlaced = Cipher.interlace(Buffer.from('0011', 'hex'), Buffer.from('ffeeddccbbaa9988', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02020800ffeeddcc11bbaa9988');
                    interlaced = Cipher.interlace(Buffer.from('00112233', 'hex'), Buffer.from('00112233445566778899aabbccddeeff', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02041000001122331144556677228899aabb33ccddeeff');
                });
                it('should interlace when lengths are not proportionate', () => {
                    let interlaced = Cipher.interlace(Buffer.from('11', 'hex'), Buffer.from('aabbcc', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02010311aabbcc');
                    interlaced = Cipher.interlace(Buffer.from('0011', 'hex'), Buffer.from('aabbcc', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02020300aabb11cc');
                    interlaced = Cipher.interlace(Buffer.from('0011', 'hex'), Buffer.from('ffeeddccbbaa99', 'hex'), 'secret-interlaced');
                    expect(interlaced.toString('hex')).toBe('02020700ffeeddcc11bbaa99');
                });
            });
            describe('vector-first', () => {
                it('should interlace correctly', () => {
                    let interlaced = Cipher.interlace(Buffer.from('00112233', 'hex'), Buffer.from('aabbccdd', 'hex'), 'vector-first');
                    expect(interlaced.toString('hex')).toBe('010404aabbccdd00112233');
                    interlaced = Cipher.interlace(Buffer.from('00112233', 'hex'), Buffer.from('aabb', 'hex'), 'vector-first');
                    expect(interlaced.toString('hex')).toBe('010402aabb00112233');
                    interlaced = Cipher.interlace(Buffer.from('0011', 'hex'), Buffer.from('aabbccdd', 'hex'), 'vector-first');
                    expect(interlaced.toString('hex')).toBe('010204aabbccdd0011');
                });
            });
            describe('vector-interlaced', () => {
                it('should interlace when secret and vector are the same length', () => {
                    let interlaced = Cipher.interlace(Buffer.from('00112233', 'hex'), Buffer.from('aabbccdd', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030404aa00bb11cc22dd33');
                    interlaced = Cipher.interlace(Buffer.from('abcd', 'hex'), Buffer.from('5678', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('03020256ab78cd');
                    interlaced = Cipher.interlace(Buffer.from('00112233445566778899aabbccddeeff', 'hex'), Buffer.from('ffeeddccbbaa99887766554433221100', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('031010ff00ee11dd22cc33bb44aa55996688777788669955aa44bb33cc22dd11ee00ff');
                });
                it('should interlace when secret is longer', () => {
                    let interlaced = Cipher.interlace(Buffer.from('1122', 'hex'), Buffer.from('aa', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030201aa1122');
                    interlaced = Cipher.interlace(Buffer.from('00112233', 'hex'), Buffer.from('aabb', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030402aa0011bb2233');
                    interlaced = Cipher.interlace(Buffer.from('0011223344556677', 'hex'), Buffer.from('aabb', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030802aa00112233bb44556677');
                    interlaced = Cipher.interlace(Buffer.from('00112233445566778899aabbccddeeff', 'hex'), Buffer.from('aabbccdd', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('031004aa00112233bb44556677cc8899aabbddccddeeff');
                });
                it('should interlace when vector is longer', () => {
                    let interlaced = Cipher.interlace(Buffer.from('11', 'hex'), Buffer.from('aabb', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030102aabb11');
                    interlaced = Cipher.interlace(Buffer.from('0011', 'hex'), Buffer.from('aabbccdd', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030204aabb00ccdd11');
                    interlaced = Cipher.interlace(Buffer.from('0011', 'hex'), Buffer.from('ffeeddccbbaa9988', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030208ffeeddcc00bbaa998811');
                    interlaced = Cipher.interlace(Buffer.from('00112233', 'hex'), Buffer.from('00112233445566778899aabbccddeeff', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030410001122330044556677118899aabb22ccddeeff33');
                });
                it('should interlace when lengths are not proportionate', () => {
                    let interlaced = Cipher.interlace(Buffer.from('11', 'hex'), Buffer.from('aabbcc', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030103aabbcc11');
                    interlaced = Cipher.interlace(Buffer.from('0011', 'hex'), Buffer.from('aabbcc', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030203aabb00cc11');
                    interlaced = Cipher.interlace(Buffer.from('0011', 'hex'), Buffer.from('ffeeddccbbaa99', 'hex'), 'vector-interlaced');
                    expect(interlaced.toString('hex')).toBe('030207ffeeddcc00bbaa9911');
                });
            });
        });
        describe('deinterlace', () => {
            describe('secret-first', () => {
                it('should deinterlace', () => {
                    let result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hello', 'ascii'), Buffer.from('world', 'ascii'), 'secret-first'));
                    expect(result.secret.toString('ascii')).toBe('hello');
                    expect(result.vector.toString('ascii')).toBe('world');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hi', 'ascii'), Buffer.from('world', 'ascii'), 'secret-first'));
                    expect(result.secret.toString('ascii')).toBe('hi');
                    expect(result.vector.toString('ascii')).toBe('world');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hello', 'ascii'), Buffer.from('you', 'ascii'), 'secret-first'));
                    expect(result.secret.toString('ascii')).toBe('hello');
                    expect(result.vector.toString('ascii')).toBe('you');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('starting over', 'ascii'), Buffer.from('as mentioned above the function declaration', 'ascii'), 'secret-first'));
                    expect(result.secret.toString('ascii')).toBe('starting over');
                    expect(result.vector.toString('ascii')).toBe('as mentioned above the function declaration');
                });
            });
            describe('secret-interlaced', () => {
                it('should deinterlace when secret and vector are the same length', () => {
                    let result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hello', 'ascii'), Buffer.from('world', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hello');
                    expect(result.vector.toString('ascii')).toBe('world');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hi', 'ascii'), Buffer.from('by', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hi');
                    expect(result.vector.toString('ascii')).toBe('by');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('01234567', 'ascii'), Buffer.from('abcdefgh', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('01234567');
                    expect(result.vector.toString('ascii')).toBe('abcdefgh');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('0123456701234567', 'ascii'), Buffer.from('abcdefghabcdefgh', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('0123456701234567');
                    expect(result.vector.toString('ascii')).toBe('abcdefghabcdefgh');
                });
                it('should deinterlace when secret is longer', () => {
                    let result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hello', 'ascii'), Buffer.from('bye', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hello');
                    expect(result.vector.toString('ascii')).toBe('bye');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hie', 'ascii'), Buffer.from('by', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hie');
                    expect(result.vector.toString('ascii')).toBe('by');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('01234567', 'ascii'), Buffer.from('abcd', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('01234567');
                    expect(result.vector.toString('ascii')).toBe('abcd');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('0123456701234567', 'ascii'), Buffer.from('ab', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('0123456701234567');
                    expect(result.vector.toString('ascii')).toBe('ab');
                });
                it('should deinterlace when vector is longer', () => {
                    let result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hi', 'ascii'), Buffer.from('world', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hi');
                    expect(result.vector.toString('ascii')).toBe('world');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hi', 'ascii'), Buffer.from('bye', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hi');
                    expect(result.vector.toString('ascii')).toBe('bye');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('0123', 'ascii'), Buffer.from('abcdefgh', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('0123');
                    expect(result.vector.toString('ascii')).toBe('abcdefgh');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('01', 'ascii'), Buffer.from('abcdefghabcdefgh', 'ascii'), 'secret-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('01');
                    expect(result.vector.toString('ascii')).toBe('abcdefghabcdefgh');
                });
            });
            describe('vector-interlaced', () => {
                it('should deinterlace when secret and vector are the same length', () => {
                    let result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hello', 'ascii'), Buffer.from('world', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hello');
                    expect(result.vector.toString('ascii')).toBe('world');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hi', 'ascii'), Buffer.from('by', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hi');
                    expect(result.vector.toString('ascii')).toBe('by');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('01234567', 'ascii'), Buffer.from('abcdefgh', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('01234567');
                    expect(result.vector.toString('ascii')).toBe('abcdefgh');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('0123456701234567', 'ascii'), Buffer.from('abcdefghabcdefgh', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('0123456701234567');
                    expect(result.vector.toString('ascii')).toBe('abcdefghabcdefgh');
                });
                it('should deinterlace when secret is longer', () => {
                    let result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hello', 'ascii'), Buffer.from('bye', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hello');
                    expect(result.vector.toString('ascii')).toBe('bye');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hie', 'ascii'), Buffer.from('by', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hie');
                    expect(result.vector.toString('ascii')).toBe('by');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('01234567', 'ascii'), Buffer.from('abcd', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('01234567');
                    expect(result.vector.toString('ascii')).toBe('abcd');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('0123456701234567', 'ascii'), Buffer.from('ab', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('0123456701234567');
                    expect(result.vector.toString('ascii')).toBe('ab');
                });
                it('should deinterlace when vector is longer', () => {
                    let result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hi', 'ascii'), Buffer.from('world', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hi');
                    expect(result.vector.toString('ascii')).toBe('world');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('hi', 'ascii'), Buffer.from('bye', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('hi');
                    expect(result.vector.toString('ascii')).toBe('bye');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('0123', 'ascii'), Buffer.from('abcdefgh', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('0123');
                    expect(result.vector.toString('ascii')).toBe('abcdefgh');
                    result = Cipher.deinterlace(Cipher.interlace(Buffer.from('01', 'ascii'), Buffer.from('abcdefghabcdefgh', 'ascii'), 'vector-interlaced'));
                    expect(result.secret.toString('ascii')).toBe('01');
                    expect(result.vector.toString('ascii')).toBe('abcdefghabcdefgh');
                });
            });
        });
        it('should have different encryptions for the same secret', () => {
            const cipher = new Cipher();
            expect(cipher.encrypt('hello')).not.toBe(cipher.encrypt('hello'));
            expect(cipher.encrypt('world')).not.toBe(cipher.encrypt('world'));
        });
        it('should only decrypt with the correct key', () => {
            const cipher1 = new Cipher();
            const cipher2 = new Cipher();
            expect(() => cipher2.decrypt(cipher1.encrypt('hello'))).toThrow();
        });
        it('should be able to decrypt itself', () => {
            const cipher = new Cipher();
            expect(cipher.decrypt(cipher.encrypt('hello'))).toBe('hello');
            expect(cipher.decrypt(cipher.encrypt('hi'))).toBe('hi');
            expect(cipher.decrypt(cipher.encrypt('hello world!'))).toBe('hello world!');
        });
    });
});
