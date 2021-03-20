import Logger from '../util/logger';

export interface ScheduledEventContext {
  logger: Logger;
}

export interface ScheduledEventOptions {
  name: string;
  buildString?: string;
}

export type ScheduledEventHandler = (
  context: ScheduledEventContext
) => Promise<[number, AnyJson]>;
