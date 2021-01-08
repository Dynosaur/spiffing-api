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

export function defensiveCopy<T>(object: T): T {
    if (typeof object === 'object') {
        const newObject = {};
        for (const property of Object.keys(object))
            if (typeof object[property] === 'object') newObject[property] = defensiveCopy(object[property]);
            else newObject[property] = object[property];
        return newObject as T;
    } else return object;
}
