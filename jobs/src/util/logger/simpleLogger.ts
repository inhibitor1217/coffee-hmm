import { LogLevel } from '../../types/env';
import BaseLogger from './baseLogger';
import { getSeverity } from './util';

export default class SimpleLogger extends BaseLogger {
  private severity: number;

  public logLevel: LogLevel;

  constructor(logLevel: LogLevel) {
    super();

    this.logLevel = logLevel;
    this.severity = getSeverity(logLevel);
  }

  public log(level: LogLevel, message: unknown): void {
    if (this.severity <= getSeverity(level)) {
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
            return JSON.stringify(message);
          default:
            throw Error(`invalid message type: ${typeof message}`);
        }
      })();

      this.logString(level, messageStr);

      if (message instanceof Error) {
        this.logStacktrace(message);
      }
    }
  }
}
