import { ILogger } from '../util/logger';

export interface EventContext {
  logger: ILogger;
}

export interface EventOptions {
  name: string;
  buildString?: string;
}

export type EventHandler = (
  context: EventContext
) => Promise<[number, AnyJson]>;
