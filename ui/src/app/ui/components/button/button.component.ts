import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'spiff-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
    @Input() emitValue: any;
    @Input() loading = false;
    @Input() disabled: boolean;
    @Output() action = new EventEmitter();
    @Input() theme: 'primary' | 'warn' = 'primary';

    onClick(): void {
        if (this.disabled) return;
        this.action.emit(this.emitValue);
    }

}
