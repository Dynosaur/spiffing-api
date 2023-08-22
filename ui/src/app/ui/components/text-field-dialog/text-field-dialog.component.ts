import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { errorsToString } from 'spiff/app/forms/validator-error-string';
import { Component, EventEmitter, OnInit } from '@angular/core';

interface InputElement {
    name: string;
    label: string;
    defaultValue?: string;
    formControl?: FormControl;
    element: 'input' | 'text-area';
}

interface Input extends InputElement {
    element: 'input';
    type?: 'text' | 'password';
}

interface TextArea extends InputElement {
    element: 'text-area';
}

export type AcceptedElements = Input | TextArea;

@Component({
    selector: 'spiff-text-field-dialog',
    templateUrl: './text-field-dialog.component.html',
    styleUrls: ['./text-field-dialog.component.scss']
})
export class TextFieldDialogComponent implements OnInit {
    title = 'Title';
    loading = false;
    fields: AcceptedElements[];
    submit = new EventEmitter();
    cancelButtonText = 'Cancel';
    submitButtonText = 'Submit';
    description = 'Description.';
    dialogRef: MatDialogRef<TextFieldDialogComponent>;

    ngOnInit(): void {
        if (this.dialogRef === undefined || this.dialogRef === null) throw new Error(`TextFieldDialogComponent: dialogRef is ${this.dialogRef}.`);
        if (this.fields === undefined || this.fields === null) throw new Error(`TextFieldDialogComponent: fields is ${this.fields}.`);
        if (this.title === 'Title') console.warn('TextFieldDialogCopmonent: title is unchanged.');
        if (this.description === 'Description.') console.warn('TextFieldDialogCopmonent: description is unchanged.');
        if (this.fields.length === 0) console.warn('TextFieldDialogComponent: fields length is 0.');
        else for (const field of this.fields) {
            if (field.formControl === undefined || field.formControl === null) field.formControl = new FormControl();
            switch (field.element) {
                case 'input':
                    if (!field.type) field.type = 'text';
                    break;
            }
        }
    }

    isValid(): boolean {
        for (const field of this.fields)
            if (!field.formControl.dirty || field.formControl.errors !== null) return false;
        return true;
    }

    getError(field: AcceptedElements): string {
        const control = field.formControl;
        if (control.errors === null)
            throw new Error(`TextFieldDialogComponent: getError called but form control ${field.name} has no errors.`);
        return errorsToString(control.errors);
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    asInput(input: AcceptedElements): Input {
        return input as Input;
    }
}
