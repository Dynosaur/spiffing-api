export type ResponseStatus = 'OK' | 'CREATED' | 'INCOMPLETE' | 'REJECTED' | 'NO_RESULTS' | 'MALFORMED';

export interface Response {
    status: ResponseStatus;
    message: string;
}

export interface DataResponse<T> extends Response {
    data: T;
}
