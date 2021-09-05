import { LogLevel } from '../../types/env';
import ILogger from './type';

export default abstract class BaseLogger implements ILogger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public log(level: LogLevel, message: unknown): void {
    throw new Error('not implemented');
  }

  public error = (message: unknown): void => this.log(LogLevel.error, message);

  public warning = (message: unknown): void =>
    this.log(LogLevel.warning, message);

  public info = (message: unknown): void => this.log(LogLevel.info, message);

  public debug = (message: unknown): void => this.log(LogLevel.debug, message);

  public verbose = (message: unknown): void =>
    this.log(LogLevel.verbose, message);

  protected logString(level: LogLevel, str: string): void {
    // eslint-disable-next-line no-console
    console.log(
      `[${new Date().toISOString()}] [${LogLevel[level].toUpperCase()}] ${str}`
    );
  }

  protected logStacktrace(error: Error): void {
    // eslint-disable-next-line no-console
    console.log(error.stack);
  }
}
