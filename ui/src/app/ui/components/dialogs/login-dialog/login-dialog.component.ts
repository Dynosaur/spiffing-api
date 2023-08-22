import { UserAccountService } from 'spiff/app/services/user-account.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateAccountDialogComponent } from 'spiff/app/ui/components/dialogs/create-account-dialog';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
    selector: 'spiff-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements AfterViewInit {
    errorMessage: string;
    loginInProgress: boolean;
    usernameForm = new FormControl('', [Validators.required]);
    passwordForm = new FormControl('', [Validators.required]);
    @ViewChild('templateUsernameForm') templateUsernameForm: ElementRef;
    @ViewChild('templatePasswordForm') templatePasswordForm: ElementRef;

    constructor(private account: UserAccountService,
                private createAccountDialog: MatDialog,
                private dialog: MatDialogRef<LoginDialogComponent>) { }

    ngAfterViewInit(): void {
        setTimeout(() => this.templateUsernameForm.nativeElement.focus(), 0);
    }

    onUsernameKeyPress(event: KeyboardEvent): void {
        if (event.key !== 'Enter') return;
        if (this.usernameForm.valid) this.templatePasswordForm.nativeElement.focus();
    }

    onPasswordKeyPress(event: KeyboardEvent): void {
        if (event.key !== 'Enter') return;
        if (this.usernameForm.valid && this.passwordForm.valid) this.submitSignIn();
    }

    async submitSignIn(): Promise<void> {
        this.errorMessage = null;
        this.loginInProgress = true;
        try {
            const login = await this.account.login(this.usernameForm.value, this.passwordForm.value);
            this.loginInProgress = false;
            if (login) this.dialog.close();
            else this.errorMessage = 'Incorrect username or password.';
        } catch (error) {
            if (error.message === 'NoConnection') {
                this.errorMessage = 'Could not connect to our services.';
                this.loginInProgress = false;
            }
        }
    }

    createNewAccount(): void {
        this.dialog.close();
        this.createAccountDialog.open(CreateAccountDialogComponent, { width: 'fit-content' });
    }
}
