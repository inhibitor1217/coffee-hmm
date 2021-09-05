import { LogLevel } from '../../types/env';

export const getSeverity = (level: LogLevel): number => {
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
