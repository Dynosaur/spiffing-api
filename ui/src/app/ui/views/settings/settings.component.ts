import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import changeScreenname from './change-screenname';
import { DialogService } from 'spiff/app/services/dialog.service';
import { sameValueValidator } from 'spiff/app/forms/validators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserAccountEvent, UserAccountService } from 'spiff/app/services/user-account.service';

@Component({
    selector: 'spiff-settings-view',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
    accountEventListener: Subscription;

    constructor(private title: Title,
                private router: Router,
                private dialog: DialogService,
                private account: UserAccountService) { }

    ngOnInit(): void {
        if (this.account.user === null) this.router.navigate(['']);
        this.title.setTitle('user settings');
        this.accountEventListener = this.account.events.subscribe(this.onUserAccountEvent.bind(this));
    }

    ngOnDestroy(): void {
        this.accountEventListener.unsubscribe();
    }

    onUserAccountEvent(event: UserAccountEvent): void {
        if (event === 'LOG_OUT') this.router.navigate(['']);
    }

    changePassword(): void {
        const passwordControl = new FormControl();
        const retypeControl = new FormControl(null, sameValueValidator(passwordControl));
        this.dialog.openGenericDialog({
            title: 'Change Password',
            submitText: 'Change',
            description: 'Please enter what you would like your new password to be.',
            fields: [
                { element: 'input', name: 'password', label: 'Password',        type: 'password', formControl: passwordControl },
                { element: 'input', name: 'retype',   label: 'Retype Password', type: 'password', formControl: retypeControl }
            ],
            onSubmit: async dialog => {
                dialog.loading = true;
                const updateRequest = await this.account.patch({ password: passwordControl.value });
                dialog.loading = false;
                if (updateRequest.ok === true) {
                    this.account.passwordChanged(passwordControl.value);
                    dialog.closeDialog();
                }
            }
        });
    }

    openChangeScreenname(): void {
        changeScreenname(this.dialog, this.account);
    }

    changeUsername(): void {
        this.dialog.openChangeUsernameDialog();
    }

    deleteAccount(): void {
        this.dialog.openDeleteAccountDialog();
    }
}
