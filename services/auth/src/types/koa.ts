import { Connection } from 'typeorm';
import { DataLoaders } from '../middlewares/db';
import Logger from '../util/logger';

export interface KoaContextState {
  logger: Logger;
  connection(): Promise<Connection>;
  loaders: DataLoaders;
}
