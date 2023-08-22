import { Stats, createReadStream, readdir, stat } from 'fs';
import { isAbsolute, resolve as pathResolve } from 'path';
import { SeamstressError } from './error';

export function getFileContents(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = createReadStream(path);
        let final = '';
        stream.on('data', data => final += data instanceof Buffer ? data.toString('ascii') : data);
        stream.on('end', () => resolve(final));
        stream.on('error', (error: any) => {
            if (error.code === 'ENOENT')
                return reject(new SeamstressError.FileNotFoundError(path));
            reject(error);
        });
    });
}

export function getAbsPathsInDir(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        if (!isAbsolute(path)) reject(new Error('Path must be absolute.\nProvided: ' + path));
        readdir(path, (error, files) => {
            if (error) reject(error);
            resolve(files.map(file => pathResolve(path, file)));
        });
    });
}

export function getStats(path: string): Promise<Stats> {
    return new Promise((resolve, reject) => {
        stat(path, (err, stats) => {
            if (err) return reject(err);
            resolve(stats);
        });
    });
}

export async function getRecursiveAbsFilesInDir(path: string): Promise<string[]> {
    if (!isAbsolute(path)) throw new Error('Path is not absolute.');

    const paths = await getAbsPathsInDir(path);
    const stats = await Promise.all(paths.map(file => getStats(file)));

    const files: string[] = [];
    const dirs: string[] = [];
    stats.forEach((stat, index) => {
        if (stat.isDirectory()) dirs.push(paths[index]);
        else files.push(paths[index]);
    });
    if (!dirs.length) return files;

    const dirFiles = await Promise.all(dirs.map(dir => getRecursiveAbsFilesInDir(dir)));
    dirFiles.forEach(childFiles => files.push(...childFiles));
    return files;
}
