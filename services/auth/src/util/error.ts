export enum ExceptionCode {
  invalidArgument,
  badRequest,
  unauthorized,
  forbidden,
}

export type ExceptionCodeStrings = keyof typeof ExceptionCode;

export default class Exception extends Error {
  public code: ExceptionCode;

  public message: string;

  constructor(code: ExceptionCode, message: string) {
    super(`[${ExceptionCode[code]}] ${message}`);

    this.code = code;
    this.message = message;
  }

  static isException(err: Error): err is Exception {
    return err instanceof Exception;
  }

  static isExceptionOf(err: Error, code: ExceptionCode): err is Exception {
    return this.isException(err) && err.code === code;
  }
}
