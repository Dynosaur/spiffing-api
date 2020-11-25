import { request } from 'http';

export function urlToHostPath(url: string): { matched: boolean, host: string; path: string; port: number; } {
    const match = url.match(/(?:(?<protocol>[\w]+):\/\/)?(?<hostname>[A-z.]+)(?::(?<port>\d+))?(?<path>\/.+)/);
    if (match) {
        return { matched: true, host: match.groups.hostname, port: parseInt(match.groups.port), path: match.groups.path };
    } else {
        return { matched: false, host: null, port: null, path: null };
    }
}

type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';
interface Headers { [header: string]: string; }
type Response<T> = {
    ok: true;
    data: T;
} | {
    ok: false;
    error: string;
}

export function createRequest<T>(method: HttpMethod, url: string, body: any, headers: Headers): Promise<Response<T>> {
    return new Promise<Response<T>>(resolve => {
        const parsedUrl = urlToHostPath(url);
        if (!parsedUrl.matched) {
            resolve({
                ok: false,
                error: 'URL could not be dissected.'
            });
        }
        const req = request({
            method,
            host: parsedUrl.host,
            path: parsedUrl.path,
            port: parsedUrl.port,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            }
        }, res => {
            let data = '';

            res.on('data', chunk => data += chunk);
            res.on('error', err => resolve({ ok: false, error: err.message }));
            res.on('end', () => {
                try {
                    resolve({ ok: true, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ ok: false, error: e });
                }
            });
        });
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

export function POST<T>(url: string, body: object, headers: Headers): Promise<Response<T>> {
    return createRequest('POST', url, body, headers);
}
