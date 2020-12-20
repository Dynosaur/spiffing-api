type SegmentType = 'path' | 'param';
export interface PathSegment {
    name: string;
    type: SegmentType;
}

export class UrlPath {

    static deinterpolate(path: string): string[] {
        return path.match(/\/[^\/]+/g);
    }

    static convertPath(path: string): PathSegment[] {
        let elements = UrlPath.deinterpolate(path);
        const sorted: PathSegment[] = [];
        if (elements) {
            elements.forEach(element => {
                if (element.startsWith('/:')) {
                    sorted.push({
                        name: /:([^\/]+)/.exec(element)[1],
                        type: 'param'
                    });
                } else {
                    sorted.push({
                        name: element.substring(1),
                        type: 'path'
                    });
                }
            });
            return sorted;
        } else {
            return null;
        }
    }

    original: string;
    segments: PathSegment[];

    constructor(path: string) {
        this.original = path;
        this.segments = UrlPath.convertPath(path);
    }

    doesMatch(path: string): boolean {
        const compare = UrlPath.convertPath(path);
        if (compare.length !== this.segments.length) {
            return false;
        }
        for (let i = 0; i < this.segments.length; i++) {
            if (this.segments[i].type === 'path') {
                if (this.segments[i].name !== compare[i].name) {
                    return false;
                }
            }
        }
        return true;
    }

    extractParams(path: string): object {
        const deinterpolated = UrlPath.deinterpolate(path);
        const params: object = { };
        for (let i = 0; i < this.segments.length; i++) {
            if (this.segments[i].type === 'param') {
                params[this.segments[i].name] = deinterpolated[i].substring(1);
            }
        }
        return params;
    }
}

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';
interface RegisteredPath {
    path: UrlPath;
    methods: HttpMethod[];
}

export class RouteRegister {

    registered: RegisteredPath[] = [];

    constructor() { }

    register(path: string, method: HttpMethod): void {
        for (const reg of this.registered) {
            if (reg.path.original === path) {
                if (!reg.methods.includes(method)) {
                    reg.methods.push(method);
                }
                return;
            }
        }
        this.registered.push({ path: new UrlPath(path), methods: [method] });
    }

}
