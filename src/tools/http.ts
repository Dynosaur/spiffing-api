import { request } from 'http';

export function urlToHostPath(url: string): { matched: boolean, host: string; path: string; port: number; } {
    const match = url.match(/(?:(?<protocol>[\w]+):\/\/)?(?<hostname>[A-z.]+)(?::(?<port>\d+))?(?<path>\/.+)/);
    if (match) {
        return { matched: true, host: match.groups.hostname, port: parseInt(match.groups.port), path: match.groups.path };
    } else {
        return { matched: false, host: null, port: null, path: null };
    }
}

export function createRequest<T>(
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
    url: string,
    format: 'json' | 'string',
    body: any,
    headers: { [header: string]: string }
): Promise<T | string> {
    return new Promise<T | string>((resolve, reject) => {
        const parsedUrl = urlToHostPath(url);
        if (!parsedUrl.matched) {
            reject('URL could not be dissected.');
        }
        const req = request({ method, host: parsedUrl.host, path: parsedUrl.path, port: parsedUrl.port, headers: { ...headers, 'Content-Type': 'application/json' } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('error', err => reject(err));
            res.on('end', () => {
                switch (format) {
                    case 'json':
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            reject(e);
                        }
                        break;
                    case 'string':
                        resolve(data);
                        break;
                    default:
                        reject('Unknown format specified.');
                }
            });
        });
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}
