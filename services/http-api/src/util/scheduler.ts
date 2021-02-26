import { Connection } from 'typeorm';
import { logLevel } from '.';
import { connect } from '../middlewares/db';
import {
  ScheduledEventContext,
  ScheduledEventHandler,
} from '../types/scheduler';
import Exception from './error';
import Logger from './logger';

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
