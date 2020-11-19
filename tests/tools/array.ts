export function fillArray<T>(length: number, fn: () => T): T[] {
    return new Array(length).fill(null).map(fn);
}
