import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'commaNumber' })
export class CommaNumberPipe implements PipeTransform {
    transform(num: number): string {
        const numString = num.toString();
        let numOfCommas = Math.floor(numString.length / 3);
        let final = '';
        let counter = 0;
        for (let i = numString.length - 1; i >= 0; i--) {
            counter++;
            final += numString.charAt(i);
            if (counter % 3 === 0 && i !== 0)
                final += ',';
        }
        return final.split('').reverse().join('');
    }
}
