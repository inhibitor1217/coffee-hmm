import type {
  CloudFrontRequestEvent,
  CloudFrontRequestHandler,
} from 'aws-lambda';
import {
  CloudFrontRequestEventContext,
  CloudFrontRequestEventHandler,
} from '../../types/cloudFrontEvent';
import { LogLevel } from '../../types/env';
import type { EventOptions } from '../../types/event';
import { SimpleLogger } from '../logger';
import { formatJobCompleteMessage } from './util';

export const cloudfrontRequestEventHandler = (
  handler: CloudFrontRequestEventHandler,
  options: EventOptions
): CloudFrontRequestHandler => (event: CloudFrontRequestEvent) => {
  const context: CloudFrontRequestEventContext = {
    event,
    logger: new SimpleLogger(LogLevel.info),
  };

  return new Promise((resolve, reject) => {
    handler(context)
      .then(({ result, body }) => {
        context.logger.info(formatJobCompleteMessage(options, 200, body));
        resolve(result);
      })
      .catch((e) => {
        context.logger.error(e);
        reject(e);
      });
  });
};
