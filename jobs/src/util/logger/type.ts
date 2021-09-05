import { LogLevel } from '../../types/env';

export default interface ILogger {
  log(level: LogLevel, message: unknown): void;
  error(message: unknown): void;
  warning(message: unknown): void;
  info(message: unknown): void;
  debug(message: unknown): void;
  verbose(message: unknown): void;
}
