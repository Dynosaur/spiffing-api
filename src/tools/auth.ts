// Could be a vulnerability? Regex may be exploited
export function decodeBasicAuth(authorizationHeader: string): { success: boolean; username: string; password: string; error: string } {
    const base64 = authorizationHeader.substring(6);
    const plainText = Buffer.from(base64, 'base64').toString('ascii');

    const usernameRegex = plainText.match(/^(\w+):/);
    if (!usernameRegex) {
        return { success: false, username: null, password: null, error: 'username' };
    }
    const username = usernameRegex[1];

    const passwordRegex = plainText.match(/:(\w+)$/);
    if (!passwordRegex) {
        return { success: false, username: null, password: null, error: 'password' };
    }
    const password = passwordRegex[1];

    return { success: true, username, password, error: null };
}
