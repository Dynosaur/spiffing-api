import { basename, dirname, join, resolve } from 'path';
import { getAbsPathsInDir, getFileContents, getRecursiveAbsFilesInDir } from './fs';
import { Request } from 'express';
import { SeamstressError } from './error';
import { StreamRoute } from 'server/route-handling/route-infra';
import { chalk } from 'tools/chalk';

interface FileQuery {
    name: string;
    type: 'interface' | 'namespace' | 'type';
}

async function queryFile(path: string, query: FileQuery[]): Promise<string> {
    const content = await getFileContents(path);

    let response = `// ${join(basename(dirname(path)), basename(path))}\n\n`;
    for (const tsItem of query) {
        let regex: RegExp;
        if (tsItem.type === 'type')
            regex = new RegExp(`type ${tsItem.name} =.+?;`, 's');
        else
            regex = new RegExp(`${tsItem.type} ${tsItem.name} {(.+?^|\\s*)}`, 'ms');
        const result = regex.exec(content);
        if (result === null)
            throw new SeamstressError.FileQueryNotFound(path, `${tsItem.type} ${tsItem.name}`, regex.source);
        response += 'export ' + result[0] + '\n\n';
    }

    return response;
}

function capitalizeFirstLetter(s: string): string {
    const capitalFirstLetter = s.slice(0, 1).toUpperCase();
    return capitalFirstLetter + s.slice(1);
}

async function getInterfaceFromFile(path: string): Promise<string> {
    const fileContents = await getFileContents(path);
    const regex = (name: string) => new RegExp(`(interface|namespace) ${name} {.+?[^ \t]}`, 's');
    const fileName = basename(path, '.ts').split('-').map(word => capitalizeFirstLetter(word)).join('');
    let tsName = 'I' + fileName; // missing.ts => IMissing
    let result = regex(tsName).exec(fileContents);
    if (result === null) {
        const dirName = capitalizeFirstLetter(basename(dirname(path)));
        tsName = 'I' + fileName + dirName; // user/get.ts => IGetUser
        result = regex(tsName).exec(fileContents);
        if (result === null) {
            tsName = 'I' + dirName + fileName; // rate/post.ts => IRatePost
            result = regex(tsName).exec(fileContents);
            if (result === null) throw new SeamstressError.FileDoesNotContainInterface(path);
        }
    }
    return 'export ' + result[0];
}

function pathToTsName(path: string): string {
    const fileName = basename(path, '.ts');
    return 'I' + fileName.split('-').map(word => capitalizeFirstLetter(word)).join('');
}

function serverFile(path: string): string {
    return resolve(__dirname, '../../server', path);
}

const manualErrorFiles = new Set(['authorization-parse.ts', 'content-not-found.ts']);
const authorizationParse = {
    path: serverFile('interface/error/authorization-parse.ts'),
    query: [
        { name: 'FailedPart', type: 'type' as const },
        { name: 'IAuthorizationParse', type: 'interface' as const }
    ]
};
const contentNotFound = {
    path: serverFile('interface/error/content-not-found.ts'),
    query: [
        { name: 'Content', type: 'type' as const },
        { name: 'IContentNotFound', type: 'interface' as const }
    ]
};

const routerFileBlacklist = new Set(['misc-router.ts', 'route-map.ts']);

async function onRequest(request: Request, verbose: boolean, fingerprint: string): Promise<void> {
    if (request.res === undefined) throw new Error('Response is undefined.');
    try {
        let response = '';

        const dataTypes = await getFileContents(serverFile('interface/data-types.ts'));
        response += '// data types\n\n' + dataTypes + '\n';

        response += await queryFile(authorizationParse.path, authorizationParse.query);
        response += await queryFile(contentNotFound.path, contentNotFound.query);
        const errorFileContent = await Promise.all(
            await getAbsPathsInDir(serverFile('interface/error')).then(paths => paths
                .filter(path => !manualErrorFiles.has(basename(path)))
                .map(path => queryFile(path, [{ name: pathToTsName(path), type: 'interface' }]))
            )
        );
        response += errorFileContent.join('');

        const routerFileContent = await Promise.all(await getRecursiveAbsFilesInDir(serverFile('router'))
        .then(paths => paths
            .filter(path => !routerFileBlacklist.has(basename(path)))
            .map(path => getInterfaceFromFile(path))
        ));
        response += routerFileContent.join('\n\n');

        request.res.write(response);
        request.res.end();
        if (verbose) chalk.lime(fingerprint + ' Seamstress request successful.\n');
    } catch (error) {
        chalk.rust(fingerprint + ' Encountered the following error:');
        console.log(error); // eslint-disable-line no-console
        request.res.status(500).json({ error, ok: false }).end();
    }
}

export const route: StreamRoute = {
    method: 'GET',
    path: '/dev/interface',
    streamHandler: onRequest
};
