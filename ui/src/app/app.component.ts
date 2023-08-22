import { DialogService } from 'spiff/app/services/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'spiff/app/services/snackbar.service';
import { Component, OnInit } from '@angular/core';
import { UserAccountEvent, UserAccountService } from 'spiff/app/services/user-account.service';
import { LOCAL_STORAGE_ACCOUNT_KEY, LocalStorageService } from 'spiff/app/services/local-storage.service';

@Component({
    selector: 'spiff-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class RootComponent implements OnInit {
    username = '';
    signedIn = false;
    loadingUsername = false;

    constructor(public dialog: DialogService,
                private route: ActivatedRoute,
                private snack: SnackbarService,
                public account: UserAccountService,
                private localStorage: LocalStorageService) { }

    async ngOnInit(): Promise<void> {
        this.route.queryParams.subscribe(query => {
            if (!query.dialog) return;
            switch (query.dialog) {
                case 'login':
                    this.dialog.openLoginDialog();
                    break;
                default:
                    throw new Error(`Unknown dialog query param provided: "${query.dialog}".`);
            }
        });
        this.account.events.subscribe((event: UserAccountEvent) => {
            switch (event) {
                case 'LOG_IN':
                    this.signedIn = true;
                    this.username = this.account.user.username;
                    break;
                case 'LOG_OUT':
                    this.signedIn = false;
                    this.username = null;
                    break;
                case 'PASSWORD_CHANGE':
                    break;
            }
        });

        // Log the user in automatically if there is data in local storage
        try {
            const readOperation = this.localStorage.read<any>(LOCAL_STORAGE_ACCOUNT_KEY);
            if (readOperation) {
                this.loadingUsername = true;
                const login = await this.account.login(readOperation.username, readOperation.password);
                if (!login) {
                    this.snack.push('Sorry, we were unable to log you in.', 'OK', 10000);
                    this.localStorage.delete(LOCAL_STORAGE_ACCOUNT_KEY);
                }
                this.loadingUsername = false;
            }
        } catch (error) {
            if (error.message === 'NoConnection') {
                this.snack.push('Sorry, we could not connect to our services.', 'OK', 10000);
                this.loadingUsername = false;
            } else {
                throw error;
            }
        }
    }
}
