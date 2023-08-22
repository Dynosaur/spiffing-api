/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */

import { Password, UserAPI, UserWrapper } from 'database/user';
import { Cipher, hash as hashFn }         from 'tools/crypto';

export class CommonActions {
    cipher = new Cipher(Buffer.from(process.env.KEY!, 'hex'));

    constructor(private userAPI: UserAPI) {}

    async authorize(username: string, password: string): Promise<UserWrapper | null> {
        const user = await this.userAPI.getByUsername(username);
        if (user)
            try {
                const decryptedDbHash = this.cipher.decrypt(user.password.hash);
                const passwordHash = hashFn(password, user.password.salt).hash;
                if (decryptedDbHash === passwordHash) return user;
            } catch (error) {}
        return null;
    }

    securePassword(password: string): Password {
        const hash = hashFn(password);
        return {
            hash: this.cipher.encrypt(hash.hash),
            salt: hash.salt
        };
    }
}
