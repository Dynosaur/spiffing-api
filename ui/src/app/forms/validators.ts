import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function sameValueValidator(mustMatch: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
        const sameValue = mustMatch.value === control.value;
        return sameValue ? null : { sameValue: { value: control.value }};
    };
}

export function valueMustNotBe(value: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
        return control.value !== value ? null : {
            mustNotEqual: {
                currentValue: control.value,
                mustNotEqual: value
            }
        };
    };
}
