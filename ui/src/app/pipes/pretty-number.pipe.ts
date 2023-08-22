import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prettyNumber' })
export class PrettyNumberPipe implements PipeTransform {
    transform(number: number): string {
        if (number < 1000) return number.toString();
        if (number < 1000000) return (number / 1000).toFixed(1) + 'k';
        if (number < 1000000000) return (number / 1000000).toFixed(1) + 'm';
        return (number / 1000000000).toFixed(1) + 'b';
    }
}
