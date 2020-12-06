import {
  AppStage,
  AppStageStrings,
  LogLevel,
  LogLevelStrings,
} from '../types/env';

export const env = (key: string): string => {
  const maybeEnv = process.env[key];

  if (!maybeEnv) {
    throw Error(`environment variable ${key} is not set`);
  }
  return maybeEnv;
};

export const appStage = (): AppStage =>
  AppStage[env('APP_STAGE') as AppStageStrings];

export const logLevel = (): LogLevel =>
  LogLevel[env('LOG_LEVEL') as LogLevelStrings];

export const version = (): string => env('APP_VERSION');

export const buildString = () =>
  `${env('APP_NAME')}@${env('APP_VERSION')}-${env('APP_STAGE')}`;
