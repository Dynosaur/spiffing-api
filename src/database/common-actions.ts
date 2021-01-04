import { Password } from './data-types';
import { Cipher, hash } from 'tools/crypto';
import { BoundUser, UserAPI } from './dbi/user-api';

export class CommonActions {

    cipher = new Cipher(Buffer.from(process.env.KEY, 'hex'));

    constructor(private userAPI: UserAPI) { }

    async authorize(username: string, password: string): Promise<BoundUser> {
        const user = await this.userAPI.readUser({ username });
        if (user)
            try {
                const authorized = this.cipher.decrypt(user.password.hash) === hash(password, user.password.salt).hash;
                if (authorized)
                    return user;
            } catch (error) {
                return null;
            }
        return null;
    }

    securePassword(password: string): Password {
        const hh = hash(password);
        return {
            hash: this.cipher.encrypt(hh.hash),
            salt: hh.salt
        };
    }

}
