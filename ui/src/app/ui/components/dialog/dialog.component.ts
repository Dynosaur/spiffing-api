import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'spiff-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    @Input() title = 'Dialog Title';

    constructor() { }

    ngOnInit(): void {
    }

}
