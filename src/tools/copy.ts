import { ObjectId } from 'mongodb';
import { UndefinedError } from './undefined-error';

export function copyArray<T>(arr: T[]): T[] {
    if (arr === undefined || arr === null) throw new UndefinedError('arr', arr);
    if (arr.length === 0) return [];
    if (typeof arr[0] === 'object') {
        const arrCopy = [];
        for (let element of arr) arrCopy.push(defensiveCopy(element));
        return arrCopy;
    } else return Array.from(arr);
}

export function defensiveCopy<T>(object: any): T | null {
    if (object === null) return null;
    if (object instanceof ObjectId) return new ObjectId(object) as any;
    if (typeof object === 'object') {
        const newObject = {} as any;
        for (const property of Object.keys(object))
            if (typeof object[property] === 'object')
                if (object[property] instanceof Array) newObject[property] = copyArray(object[property]);
                else newObject[property] = defensiveCopy(object[property]);
            else newObject[property] = object[property];
        return newObject as T;
    } else return object;
}
