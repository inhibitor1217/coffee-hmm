import { Connection } from 'typeorm';
import Logger from '../util/logger';

export interface ScheduledEventContext {
  connection(): Promise<Connection>;
  logger: Logger;
  status: number;
  body: AnyJson;
}

export type ScheduledEventHandler = (
  context: ScheduledEventContext
) => Promise<void>;
