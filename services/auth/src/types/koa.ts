import { Connection } from 'typeorm';
import Logger from '../util/logger';

export interface KoaContextState {
  logger: Logger;
  connection(): Promise<Connection>;
}
