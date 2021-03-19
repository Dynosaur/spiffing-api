import { basename, dirname, resolve } from 'path';
import { getAbsPathsInDir, getFileContents, getRecursiveAbsFilesInDir } from './fs';
import { Request } from 'express';
import { SeamstressError } from './error';
import { StreamRoute } from 'server/route-handling/route-infra';
import { chalk } from 'tools/chalk';

const IGNORED_ROUTER_FILES = new Set(['misc-router.ts', 'route-map.ts']);
function isIgnored(path: string): boolean {
    for (const ignored of IGNORED_ROUTER_FILES)
        if (path.endsWith(ignored)) return true;
    return false;
}

function capitalizeFirstLetter(s: string): string {
    const capitalFirstLetter = s.slice(0, 1).toUpperCase();
    return capitalFirstLetter + s.slice(1);
}

function pathToInterfaceName(path: string): string {
    return 'I' + basename(path, '.ts').split('-').map(
        kebabWord => capitalizeFirstLetter(kebabWord)
    ).join('');
}

type InterfaceFromFileResult = Promise<{ code: string; name: string; }>;

async function getInterfaceFromFile(path: string): InterfaceFromFileResult {
    const fileLines = (await getFileContents(path)).replace('\r', '').split('\n');
    let matchedName = 'default';
    let startLine = -1;
    let endLine = -1;
    let depth = 0;
    let searchingForName = true;
    let searchingForClose = false;
    for (let index = 0; index < fileLines.length; index++) {
        const line = fileLines[index];
        if (searchingForName) {
            const regex = (interfaceName: string) => new RegExp(`(interface|namespace) ${interfaceName} {`);
            matchedName = pathToInterfaceName(path);
            if (!regex(matchedName).test(line)) {
                matchedName = 'I' + matchedName.slice(1) + capitalizeFirstLetter(basename(dirname(path)));
                if (!regex(matchedName).test(line)) {
                    matchedName = 'I' + capitalizeFirstLetter(basename(dirname(path))) + pathToInterfaceName(path).slice(1);
                    if (!regex(matchedName).test(line)) continue;
                }
            }
            depth = 1;
            startLine = index;
            searchingForName = false;
            searchingForClose = true;
            continue;
        }
        if (searchingForClose && line.includes('{')) depth++;
        if (searchingForClose && line.includes('}')) {
            depth--;
            if (depth === 0) {
                endLine = index;
                break;
            }
        }
    }
    if (startLine === -1) throw new SeamstressError.FileDoesNotContainInterface(path);
    if (endLine === -1) throw new SeamstressError.CouldNotFindInterfaceEnd(path, matchedName);
    return {
        code: fileLines.slice(startLine, endLine).concat('}').join('\n'),
        name: matchedName
    };
}

async function getInterfaceFileNames(): Promise<string[]> {
    const absolutePaths: string[] = [];

    const interfaceErrorPath = resolve(__dirname, '../../server/interface/error');
    const interfaceErrorPaths = await getAbsPathsInDir(interfaceErrorPath);
    absolutePaths.push(...interfaceErrorPaths);

    const routerPath = resolve(__dirname, '../../server/router');
    const routerPaths = await getRecursiveAbsFilesInDir(routerPath);
    absolutePaths.push(...routerPaths);

    return absolutePaths.filter(path => !isIgnored(path));
}

async function onRequest(request: Request, verbose: boolean, fingerprint: string): Promise<void> {
    if (request.res === undefined) throw new Error('Response is undefined.');
    try {
        let response = '';

        const dataTypesPath = resolve(__dirname, '../../server/interface/data-types.ts');
        const dataTypes = await getFileContents(dataTypesPath);
        response += '// data types\n\n' + dataTypes;

        const paths = await getInterfaceFileNames();
        const code = await Promise.all(paths.map(path => getInterfaceFromFile(path)));
        response += '\n// various interfaces\n\n' + code.map(code => code.code).join('\n\n');

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
