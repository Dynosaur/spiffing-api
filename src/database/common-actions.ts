import { Password } from './data-types';
import { Cipher, hash } from 'tools/crypto';
import { BoundUser, UserAPI } from './dbi/user-api';

export class CommonActions {

    cipher = new Cipher(Buffer.from(process.env.KEY, 'hex'));

    constructor(private userAPI: UserAPI) { }

    async authenticate(username: string, password: string): Promise<{ ok: true; user: BoundUser; } | { ok: false; }> {
        const user = await this.userAPI.readUser({ username });
        if (user) {
            try {
                const authorized = this.cipher.decrypt(user.password.hash) === hash(password, user.password.salt).hash;
                if (authorized) return { ok: true, user };
            } catch (error) {
                return { ok: false };
            }
        }
        return { ok: false };
    }

    securePassword(password: string): Password {
        const hh = hash(password);
        return {
            hash: this.cipher.encrypt(hh.hash),
            salt: hh.salt
        };
    }

}
