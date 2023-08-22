import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ApiService } from 'spiff/app/api/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { UserAccountService } from 'spiff/app/services/user-account.service';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
    selector: 'spiff-create-account-dialog',
    templateUrl: './create-account-dialog.component.html',
    styleUrls: ['./create-account-dialog.component.scss']
})
export class CreateAccountDialogComponent {
    public registerError: string;
    public creatingAccount = false;
    public retypePasswordErrorMap = new Map<string, string>();
    public retypePasswordErrorPriority = ['required', 'sameValue'];
    public usernameControl = new FormControl('', [Validators.required]);
    public passwordControl = new FormControl('', [Validators.required]);
    public retypePasswordControl = new FormControl('', [Validators.required, this.sameValueValidator(this.passwordControl)]);

    constructor(private dialog: MatDialogRef<CreateAccountDialogComponent>,
                private api: ApiService,
                private snackbar: MatSnackBar,
                private user: UserAccountService,
                private router: Router) {
        this.retypePasswordErrorMap.set('required', 'Please retype your password');
        this.retypePasswordErrorMap.set('sameValue', 'Passwords to not match');
    }

    private sameValueValidator(mustMatch: AbstractControl): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const sameValue = mustMatch.value === control.value;
            return sameValue ? null : { sameValue: false };
        };
    }

    public async createAccount(): Promise<void> {
        this.creatingAccount = true;
        const registerRequest = await this.api.register(this.usernameControl.value, this.passwordControl.value);
        if (registerRequest.ok) {
            await this.user.login(this.usernameControl.value, this.passwordControl.value);
            this.creatingAccount = false;
            this.dialog.close();
            this.snackbar.open('Successfully created new account.', 'OK', { duration: 3000 });
            this.router.navigate(['user', this.user.user.username]);
        } else {
            this.creatingAccount = false;
            this.registerError = (registerRequest as any).error;
            console.log('There literally is an error but i can\'t access it: ' + (registerRequest as any).error);
        }
    }

}
