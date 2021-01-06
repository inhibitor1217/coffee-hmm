export enum AppStage {
  local,
  beta,
  release,
}

export type AppStageStrings = keyof typeof AppStage;

export enum LogLevel {
  verbose,
  debug,
  info,
  warning,
  error,
}

export type LogLevelStrings = keyof typeof LogLevel;
