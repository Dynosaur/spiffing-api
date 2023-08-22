import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[viewContainer]',
    exportAs: 'viewContainer'
})
export class ViewContainerDirective {
    constructor(public container: ViewContainerRef) { }
}
