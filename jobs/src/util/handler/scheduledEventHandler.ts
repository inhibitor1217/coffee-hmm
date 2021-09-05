import { Exception } from '@coffee-hmm/common';
import { logLevel } from '..';
import { EventContext, EventHandler, EventOptions } from '../../types/event';
import { Logger } from '../logger';
import { formatBody, formatJobCompleteMessage } from './util';

const scheduledEventHandler = (
  handler: EventHandler,
  options: EventOptions
) => () => {
  const context: EventContext = {
    logger: new Logger(logLevel()),
  };

  return new Promise((resolve, reject) => {
    handler(context)
      .then(([status, body]) => {
        context.logger.info(formatJobCompleteMessage(options, status, body));
        resolve({
          statusCode: status ?? 501,
          body: formatBody(body),
        });
      })
      .catch((e) => {
        context.logger.error(Exception.isException(e) ? e.message : e);
        reject(e);
      });
  });
};

export default scheduledEventHandler;
