import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

type ObfuscationStrategy = 'secret-first' | 'vector-first' | 'secret-interlaced' | 'vector-interlaced';

export class Cipher {

    static interlace(secret: Buffer, vector: Buffer, strategy: ObfuscationStrategy): Buffer {
        switch (strategy) {
            case 'secret-first':
                return Buffer.concat([
                    Buffer.from([0, secret.length, vector.length]),
                    secret,
                    vector
                ]);
            case 'secret-interlaced': {
                let interlaced = Buffer.from([2, secret.length, vector.length]);
                const secretStep = Math.ceil(secret.length / vector.length);
                const vectorStep = Math.ceil(vector.length / secret.length);
                for (let index = 0; index < vector.length; index++) {
                    interlaced = Buffer.concat([
                        interlaced,
                        secret.subarray(index * secretStep, index * secretStep + secretStep),
                        vector.subarray(index * vectorStep, index * vectorStep + vectorStep)
                    ]);
                }
                return interlaced;
            }
            case 'vector-first':
                return Buffer.concat([
                    Buffer.from([1, secret.length, vector.length]),
                    vector,
                    secret
                ]);
            case 'vector-interlaced': {
                let interlaced = Buffer.from([3, secret.length, vector.length]);
                const secretStep = Math.ceil(secret.length / vector.length);
                const vectorStep = Math.ceil(vector.length / secret.length);
                for (let index = 0; index < vector.length; index++) {
                    interlaced = Buffer.concat([
                        interlaced,
                        vector.subarray(index * vectorStep, index * vectorStep + vectorStep),
                        secret.subarray(index * secretStep, index * secretStep + secretStep)
                    ]);
                }
                return interlaced;
            }
        }
    }

    static deinterlace(interlaced: Buffer): { secret: Buffer; vector: Buffer; } {
        const strategy = interlaced[0];
        interlaced = interlaced.subarray(1);

        const secretLength = interlaced[0];
        interlaced = interlaced.subarray(1);
        const vectorLength = interlaced[0];
        interlaced = interlaced.subarray(1);

        switch (strategy) {
            case 0:
                return {
                    secret: interlaced.subarray(0, secretLength),
                    vector: interlaced.subarray(secretLength)
                };
            case 1:
                return {
                    secret: interlaced.subarray(vectorLength),
                    vector: interlaced.subarray(0, vectorLength)
                };
            case 2: {
                let secret = Buffer.alloc(0);
                let vector = Buffer.alloc(0);

                const secretGroupLength = Math.ceil(secretLength / vectorLength);
                const vectorGroupLength = Math.ceil(vectorLength / secretLength);
                for (let i = 0; i < interlaced.length; i += secretGroupLength + vectorGroupLength) {
                    if (secret.length + secretGroupLength >= secretLength) {
                        const remaining = secretLength - secret.length;
                        secret = Buffer.concat([secret, interlaced.subarray(i, i + remaining)]);
                        vector = Buffer.concat([vector, interlaced.subarray(i + remaining)]);
                        break;
                    }
                    const firstVector = i + secretGroupLength;
                    secret = Buffer.concat([secret, interlaced.subarray(i, firstVector)]);
                    vector = Buffer.concat([vector, interlaced.subarray(firstVector, firstVector + vectorGroupLength)]);
                }
                return { secret, vector };
            }
            case 3: {
                let secret = Buffer.alloc(0);
                let vector = Buffer.alloc(0);

                const secretGroupLength = Math.ceil(secretLength / vectorLength);
                const vectorGroupLength = Math.ceil(vectorLength / secretLength);
                for (let i = 0; i < interlaced.length; i += secretGroupLength + vectorGroupLength) {
                    if (vector.length + vectorGroupLength >= vectorLength) {
                        const remaining = vectorLength - vector.length;
                        vector = Buffer.concat([vector, interlaced.subarray(i, i + remaining)]);
                        secret = Buffer.concat([secret, interlaced.subarray(i + remaining)]);
                        break;
                    }
                    const firstSecret = i + vectorGroupLength;
                    vector = Buffer.concat([vector, interlaced.subarray(i, firstSecret)]);
                    secret = Buffer.concat([secret, interlaced.subarray(firstSecret, firstSecret + secretGroupLength)]);
                }
                return { secret, vector };
            }
        }
    }

    private algorithm = 'aes-256-cbc';

    constructor(public key = randomBytes(32)) {
        if (key.length !== 32) {
            throw new Error(`Key must be 32 bytes long! Provided length: ${key.length}`);
        }
    }

    encrypt(plain: string): string {
        const vector = randomBytes(16);

        const cipher = createCipheriv(this.algorithm, this.key, vector);
        let secret = cipher.update(plain);
        secret = Buffer.concat([secret, cipher.final()]);

        return Cipher.interlace(
            secret,
            vector,
            (['secret-first', 'vector-first', 'secret-interlaced', 'vector-interlaced'][Math.round(Math.random() * 3)]) as ObfuscationStrategy
        ).toString('hex');
    }

    decrypt(encrypted: string): string {
        const result = Cipher.deinterlace(Buffer.from(encrypted, 'hex'));

        const secret = result.secret;
        const vector = result.vector;

        const decipher = createDecipheriv(this.algorithm, this.key, vector);
        let plain = decipher.update(secret);
        plain = Buffer.concat([plain, decipher.final()]);

        return plain.toString();
    }
}
