import { LogLevel } from '../../types/env';
import type {
  EventContext,
  EventHandler,
  EventOptions,
} from '../../types/event';
import { SimpleLogger } from '../logger';
import { formatBody, formatJobCompleteMessage } from './util';

const cloudfrontEventHandler = (
  handler: EventHandler,
  options: EventOptions
) => () => {
  const context: EventContext = {
    logger: new SimpleLogger(LogLevel.info),
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
        context.logger.error(e);
        reject(e);
      });
  });
};

export default cloudfrontEventHandler;
