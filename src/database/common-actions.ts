import { Cipher, hash } from 'tools/crypto';
import { UserAPI } from './dbi/user-api';
import { Password } from './data-types';

export class CommonActions {

    cipher = new Cipher(Buffer.from(process.env.KEY, 'hex'));

    constructor(private userAPI: UserAPI) { }

    async authenticate(username: string, password: string): Promise<boolean> {
        const user = await this.userAPI.readUser({ username });
        if (user) {
            try {
                return this.cipher.decrypt(user.password.hash) === hash(password, user.password.salt).hash;
            } catch (error) {
                return false;
            }
        } else {
            return false;
        }
    }

    securePassword(password: string): Password {
        const hh = hash(password);
        return {
            hash: this.cipher.encrypt(hh.hash),
            salt: hh.salt
        };
    }

}
