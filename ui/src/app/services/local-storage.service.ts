import { Injectable } from '@angular/core';

export const LOCAL_STORAGE_ACCOUNT_KEY = 'spf-account';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    write(key: string, data: object): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    read<T>(key: string): T {
        const data = JSON.parse(localStorage.getItem(key));
        return data || null;
    }

    delete(key: string): void {
        localStorage.removeItem(key);
    }
}
