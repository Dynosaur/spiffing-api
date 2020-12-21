import { Password } from 'app/database/data-types';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

export function interlace(buf1: Buffer, buf2: Buffer, strategy = Math.round(Math.random() * 3)): Buffer {
    switch (strategy) {
        case 0:
            return Buffer.concat([
                Buffer.from([0, buf1.length, buf2.length]),
                buf1,
                buf2
            ]);
        case 1:
            return Buffer.concat([
                Buffer.from([1, buf1.length, buf2.length]),
                buf2,
                buf1
            ]);
        case 2: {
            let interlaced = Buffer.from([2, buf1.length, buf2.length]);
            const secretStep = Math.ceil(buf1.length / buf2.length);
            const vectorStep = Math.ceil(buf2.length / buf1.length);
            for (let index = 0; index < buf2.length; index++) {
                interlaced = Buffer.concat([
                    interlaced,
                    buf1.subarray(index * secretStep, index * secretStep + secretStep),
                    buf2.subarray(index * vectorStep, index * vectorStep + vectorStep)
                ]);
            }
            return interlaced;
        }
        case 3: {
            let interlaced = Buffer.from([3, buf1.length, buf2.length]);
            const secretStep = Math.ceil(buf1.length / buf2.length);
            const vectorStep = Math.ceil(buf2.length / buf1.length);
            for (let index = 0; index < buf2.length; index++) {
                interlaced = Buffer.concat([
                    interlaced,
                    buf2.subarray(index * vectorStep, index * vectorStep + vectorStep),
                    buf1.subarray(index * secretStep, index * secretStep + secretStep)
                ]);
            }
            return interlaced;
        }
    }
}

export function deinterlace(interlaced: Buffer): { buf1: Buffer; buf2: Buffer; } {
    const strategy = interlaced[0];
    interlaced = interlaced.subarray(1);

    const buf1Len = interlaced[0];
    interlaced = interlaced.subarray(1);
    const buf2Len = interlaced[0];
    interlaced = interlaced.subarray(1);

    switch (strategy) {
        case 0:
            return {
                buf1: interlaced.subarray(0, buf1Len),
                buf2: interlaced.subarray(buf1Len)
            };
        case 1:
            return {
                buf1: interlaced.subarray(buf2Len),
                buf2: interlaced.subarray(0, buf2Len)
            };
        case 2: {
            let buf1 = Buffer.alloc(0);
            let buf2 = Buffer.alloc(0);

            const buf1GroupLen = Math.ceil(buf1Len / buf2Len);
            const buf2GroupLen = Math.ceil(buf2Len / buf1Len);
            for (let i = 0; i < interlaced.length; i += buf1GroupLen + buf2GroupLen) {
                if (buf1.length + buf1GroupLen >= buf1Len) {
                    const remaining = buf1Len - buf1.length;
                    buf1 = Buffer.concat([buf1, interlaced.subarray(i, i + remaining)]);
                    buf2 = Buffer.concat([buf2, interlaced.subarray(i + remaining)]);
                    break;
                }
                const firstBuf2 = i + buf1GroupLen;
                buf1 = Buffer.concat([buf1, interlaced.subarray(i, firstBuf2)]);
                buf2 = Buffer.concat([buf2, interlaced.subarray(firstBuf2, firstBuf2 + buf2GroupLen)]);
            }
            return { buf1, buf2 };
        }
        case 3: {
            let buf1 = Buffer.alloc(0);
            let buf2 = Buffer.alloc(0);

            const buf1GrpLen = Math.ceil(buf1Len / buf2Len);
            const buf2GrpLen = Math.ceil(buf2Len / buf1Len);
            for (let i = 0; i < interlaced.length; i += buf1GrpLen + buf2GrpLen) {
                if (buf2.length + buf2GrpLen >= buf2Len) {
                    const remaining = buf2Len - buf2.length;
                    buf2 = Buffer.concat([buf2, interlaced.subarray(i, i + remaining)]);
                    buf1 = Buffer.concat([buf1, interlaced.subarray(i + remaining)]);
                    break;
                }
                const firstBuf1 = i + buf2GrpLen;
                buf2 = Buffer.concat([buf2, interlaced.subarray(i, firstBuf1)]);
                buf1 = Buffer.concat([buf1, interlaced.subarray(firstBuf1, firstBuf1 + buf1GrpLen)]);
            }
            return { buf1, buf2 };
        }
    }
}


export class Cipher {

    private algorithm = 'aes-256-cbc';

    constructor(public key = randomBytes(32)) {
        if (key.length !== 32) throw new Error(`Key must be 32 bytes long! Provided length: ${key.length}`);
    }

    encrypt(plain: string): string {
        const vector = randomBytes(16);

        const cipher = createCipheriv(this.algorithm, this.key, vector);
        let secret = cipher.update(plain);
        secret = Buffer.concat([secret, cipher.final()]);

        return interlace(secret, vector).toString('hex');
    }

    decrypt(encrypted: string): string {
        if (!encrypted) throw new Error('Could not decrypt: Input was undefined / null');
        const result = deinterlace(Buffer.from(encrypted, 'hex'));

        const secret = result.buf1;
        const vector = result.buf2;

        const decipher = createDecipheriv(this.algorithm, this.key, vector);
        let plain = decipher.update(secret);

        try {
            plain = Buffer.concat([plain, decipher.final()]);
        } catch (error) {
            if (error.reason === 'bad decrypt') throw new Error('Bad decrypt: this is usually caused by mismatched keys.');
            throw error;
        }

        return plain.toString();
    }
}

export function hash(plain: string, salt = randomBytes(32).toString('hex')): Password {
    const hash = createHash('sha256');
    hash.update(plain + salt);
    return {
        hash: hash.digest('hex'),
        salt
    };
}
