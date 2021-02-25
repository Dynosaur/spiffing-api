export class SwitchMap<KeyType> {
    private map = new Map<KeyType, boolean>();

    on(key: KeyType) {
        if (this.map.has(key)) {
            if (this.map.get(key) === false)
                this.map.set(key, true);
        } else
            this.map.set(key, true);
    }

    off(key: KeyType) {
        if (this.map.has(key)) {
            if (this.map.get(key) === true)
                this.map.set(key, false);
        } else
            this.map.set(key, false);
    }

    keys(): IterableIterator<KeyType> {
        return this.map.keys();
    }

    clear(): void {
        this.map.clear();
    }

    has(key: KeyType): boolean {
        return this.map.has(key);
    }

    delete(key: KeyType): void {
        if (this.map.has(key)) {
            this.map.delete(key);
        }
    }
}
