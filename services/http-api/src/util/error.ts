export enum ExceptionCode {
  invalidArgument,
  badRequest,
  forbidden,
  notFound,
  notImplemented,
  unauthorized,
  service,
}

export type ExceptionCodeStrings = keyof typeof ExceptionCode;

export default class Exception extends Error {
  public code: ExceptionCode;

  public payload: unknown;

  constructor(code: ExceptionCode, payload?: unknown) {
    super(`[${ExceptionCode[code].toUpperCase()}] ${JSON.stringify(payload)}`);

    this.code = code;
    this.payload = payload;
  }

  static isException(err: Error): err is Exception {
    return err instanceof Exception;
  }

  static isExceptionOf(err: Error, code: ExceptionCode): err is Exception {
    return this.isException(err) && err.code === code;
  }
}
