import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'spiff/app/services/snackbar.service';
import { UserAccountService } from 'spiff/app/services/user-account.service';

@Component({
    selector: 'spiff-delete-account-confirm-dialog',
    templateUrl: './delete-account-confirm-dialog.component.html',
    styleUrls: ['./delete-account-confirm-dialog.component.scss']
})
export class DeleteAccountConfirmDialogComponent {
    accountDeletionInProgress = false;

    constructor(private dialog: MatDialog,
                private router: Router,
                private snackbar: SnackbarService,
                private account: UserAccountService) { }

    async deleteAccount(): Promise<void> {
        this.accountDeletionInProgress = true;
        const deregisterRequest = await this.account.deregister();
        if (deregisterRequest.ok === true) {
            this.accountDeletionInProgress = false;
            this.dialog.closeAll();
            this.account.logOut();
            this.snackbar.push('Account successfully deleted.', 'OK', 3000);
            this.router.navigate(['']);
        } else throw new Error(deregisterRequest.error);
    }

}
