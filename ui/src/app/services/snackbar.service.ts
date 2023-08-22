import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface SnackbarData {
    content: string;
    button?: string;
    duration?: number;
}

type SnackbarEvent = 'NEW' | 'DESTROYED';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private visibleNotifs = 0;
    private maxVisibleNotifs = 3;
    private notifications: SnackbarData[] = [];

    constructor(private snack: MatSnackBar) { }

    public push(content: string, button?: string, duration?: number): void {
        this.notifications.push({ content, button, duration });
        this.onSnackEvent('NEW');
    }

    private onSnackEvent(event: SnackbarEvent): void {
        switch (event) {
            case 'NEW':
                if (this.visibleNotifs < this.maxVisibleNotifs) {
                    const notif = this.notifications.pop();
                    this.snack.open(notif.content, notif.button, { duration: notif.duration });
                    this.visibleNotifs++;

                    if (notif.duration) {
                        setTimeout(() => this.onSnackEvent('DESTROYED'), notif.duration);
                    }
                }
                break;
            case 'DESTROYED':
                this.visibleNotifs--;
        }
    }
}
