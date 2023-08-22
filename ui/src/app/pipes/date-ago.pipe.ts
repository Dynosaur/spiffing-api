import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateAgo' })
export class DateAgoPipe implements PipeTransform {
    transform(num: number): string {
        const now = new Date();
        const then = new Date(num * 1000);
        const seconds = Math.round((now.getTime() - then.getTime()) / 1000);
        if (seconds < 60) return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
        const minutes = Math.round(seconds / 60);
        if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
        const hours = Math.round(minutes / 60);
        if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        const days = Math.round(hours / 24);
        return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
}
