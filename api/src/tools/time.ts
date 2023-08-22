export function prettyTimestamp(): string {
    const now = new Date(Date.now());
    return `${now.getDate()}/${now.toLocaleString('default', { month: 'short' })}/${now.getFullYear()} ${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}`;
}
