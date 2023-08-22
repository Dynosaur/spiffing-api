import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserAccountService } from 'spiff/app/services/user-account.service';

@Component({
    selector: 'spiff-change-username-dialog',
    templateUrl: './change-username-dialog.component.html',
    styleUrls: ['./change-username-dialog.component.scss']
})
export class ChangeUsernameDialogComponent implements OnInit {
    loggedIn = false;
    usernameFormControl = new FormControl();

    constructor(private account: UserAccountService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.loggedIn = !!this.account.user;
        if (!this.loggedIn) this.account.events.subscribe((event: boolean) => this.loggedIn = event);
    }

    getUsername(): string {
        return this.account.user.username;
    }

    canChange(): boolean {
        return this.usernameFormControl.value !== this.account.user.username;
    }

    async changeUsername(): Promise<void> {
        const newUsername = this.usernameFormControl.value;
        const updateRequest = await this.account.patch({ username: newUsername });
        if (updateRequest.ok) {
            this.account.usernameChanged(newUsername);
            this.dialog.closeAll();
        }
    }

}
