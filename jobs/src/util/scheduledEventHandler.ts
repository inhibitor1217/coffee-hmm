import 'pg';

import { readFile } from 'fs';
import { Exception } from '@coffee-hmm/common';
import path from 'path';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { env, logLevel } from '.';
import entities from '../entities';
import {
  ScheduledEventContext,
  ScheduledEventHandler,
} from '../types/scheduledEvent';
import Logger from './logger';

const readOrmConfig = (): Promise<ConnectionOptions> =>
  new Promise<AnyJson>((resolve, reject) => {
    if (process.env.TEST_ORMCONFIG) {
      resolve(JSON.parse(process.env.TEST_ORMCONFIG));
      return;
    }

    readFile(
      path.resolve(process.cwd(), env('ORMCONFIG_FILE')),
      'utf8',
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          const config = JSON.parse(data);
          resolve(config);
        }
      }
    );
  }).then((config) => (config as unknown) as ConnectionOptions);

export const connect = async () =>
  createConnection({
    ...(await readOrmConfig()),
    entities,
  });

const scheduledEventHandler = (handler: ScheduledEventHandler) => () => {
  let connection: Connection | null = null;

  const context: ScheduledEventContext = {
    connection: async () => {
      if (!connection) {
        connection = await connect();
      }
      return connection;
    },
    logger: new Logger(logLevel()),
    status: 501,
    body: null,
  };

  return new Promise((resolve, reject) => {
    handler(context)
      .then(() => {
        resolve({
          statusCode: context.status,
          body:
            typeof context.body === 'string'
              ? context.body
              : JSON.stringify(context.body),
        });
      })
      .catch((e) => {
        context.logger.error(Exception.isException(e) ? e.message : e);
        reject(e);
      });
  });
};

export default scheduledEventHandler;
