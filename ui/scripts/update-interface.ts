import chalk from 'chalk';
import { environment } from '../src/environments/environment';

if (environment.production) {
    console.error(chalk.redBright('This script cannot be run in production mode.'));
}

import { access, constants, writeFile } from 'fs';
import { get } from 'http';
import { resolve } from 'path';

const apiUrl = environment.apiHost;

function getFromNetworkPath(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = get(apiUrl + path, res => {
            let data = '';
            res.on('data', chunk => data += chunk.toString());
            res.on('error', error => reject(error));
            res.on('end', () => {
                if (res.statusCode === 200) return resolve(data);
                else reject({ code: res.statusCode, message: res.statusMessage, body: data });
            });
        });
        req.on('error', err => reject(err));
    });
};

function exists(path: string): Promise<boolean> {
    return new Promise(resolve => {
        access(path, constants.W_OK, err => {
            if (err) resolve(false);
            resolve(true);
        });
    });
}

function writeFilePromise(path: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        writeFile(path, data, err => {
            if (err) reject(err);
            resolve();
        });
    });
}

async function update(): Promise<void> {
    const destDir = resolve(__dirname, '../src/app/api');
    if (!await exists(destDir))
        throw new Error(`Could not find destination directory, should be at: ${destDir}`);

    let data: string;
    data = await getFromNetworkPath('/api/dev/interface');

    const target = resolve(__dirname, '../src/app/api/interface.ts');
    await writeFilePromise(target, data);
};

update()
    .then(() => console.log(chalk.greenBright('Update successful.')))
    .catch(error => {
        console.log(chalk.redBright('Encountered an error while updating: '));
        console.log(error);
    });
