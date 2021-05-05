export declare enum ExceptionCode {
    invalidArgument = 0,
    notImplemented = 1,
    badRequest = 2,
    unauthorized = 3,
    forbidden = 4,
    notFound = 5,
    service = 6
}
export declare type ExceptionCodeStrings = keyof typeof ExceptionCode;
export default class Exception extends Error {
    code: ExceptionCode;
    payload: unknown;
    constructor(code: ExceptionCode, payload?: unknown);
    static isException(err: Error): err is Exception;
    static isExceptionOf(err: Error, code: ExceptionCode): err is Exception;
}
