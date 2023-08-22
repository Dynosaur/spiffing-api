import { FormControl } from '@angular/forms';
import { DialogService } from 'spiff/app/services/dialog.service';
import { valueMustNotBe } from 'spiff/app/forms/validators';
import { UserAccountService } from 'spiff/app/services/user-account.service';

export default function changeScreenname(dialogService: DialogService, accountService: UserAccountService): void {
    const screennameControl = new FormControl(
        accountService.user.screenname,
        valueMustNotBe(accountService.user.screenname)
    );
    dialogService.openGenericDialog({
        title: 'Change Screen Name',
        submitText: 'Change',
        description: 'Please enter what you would like your new screen name to be.',
        fields: [
            {
                element: 'input',
                name: 'screenname',
                label: 'Screen Name',
                formControl: screennameControl
            }
        ],
        onSubmit: async dialog => {
            dialog.loading = true;
            const updateRequest = await accountService.patch({ screenname: screennameControl.value });
            dialog.loading = false;
            if (updateRequest.ok === true) {
                accountService.passwordChanged(screennameControl.value);
                dialog.closeDialog();
            }
        }
    });
}
