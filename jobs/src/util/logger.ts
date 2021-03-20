import { appStage } from '.';
import { AppStage, LogLevel } from '../types/env';

const getSeverity = (level: LogLevel): number => {
  switch (level) {
    case LogLevel.verbose:
      return 100;
    case LogLevel.debug:
      return 200;
    case LogLevel.info:
      return 300;
    case LogLevel.warning:
      return 400;
    case LogLevel.error:
      return 500;
    default:
      throw Error(`invalid log level: ${LogLevel[level]}`);
  }
};

export default class Logger {
  private severity: number;

  public logLevel: LogLevel;

  constructor(logLevel: LogLevel) {
    this.logLevel = logLevel;
    this.severity = getSeverity(logLevel);
  }

  public log(level: LogLevel, message: unknown): void {
    if (this.severity <= getSeverity(level)) {
      const prettify = appStage() === AppStage.local;
      const messageStr = (() => {
        switch (typeof message) {
          case 'number':
          case 'bigint':
          case 'boolean':
          case 'function':
          case 'string':
          case 'symbol':
            return message.toString();
          case 'undefined':
            return '(undefined)';
          case 'object':
            if (prettify) {
              return JSON.stringify(message, null, 2);
            }
            return JSON.stringify(message);
          default:
            throw Error(`invalid message type: ${typeof message}`);
        }
      })();

      // eslint-disable-next-line no-console
      console.log(
        `[${new Date().toISOString()}] [${LogLevel[
          level
        ].toUpperCase()}] ${messageStr}`
      );

      if (message instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(message.stack);
      }
    }
  }

  public error = (message: unknown): void => this.log(LogLevel.error, message);

  public warning = (message: unknown): void =>
    this.log(LogLevel.warning, message);

  public info = (message: unknown): void => this.log(LogLevel.info, message);

  public debug = (message: unknown): void => this.log(LogLevel.debug, message);

  public verbose = (message: unknown): void =>
    this.log(LogLevel.verbose, message);
}
