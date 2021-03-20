import { Exception } from '@coffee-hmm/common';
import { logLevel, buildString } from '.';
import {
  ScheduledEventContext,
  ScheduledEventHandler,
  ScheduledEventOptions,
} from '../types/scheduledEvent';
import Logger from './logger';

const formatBody = (body: AnyJson) =>
  typeof body === 'string' ? body : JSON.stringify(body);

const formatJobCompleteMessage = (
  options: ScheduledEventOptions,
  statusCode: number,
  body: AnyJson
): string => {
  const { name, buildString: version = buildString() } = options;

  return [
    `job.name: ${name}`,
    `job.version: ${version}`,
    `statusCode: ${statusCode}`,
    formatBody(body),
  ].join('\n');
};

const scheduledEventHandler = (
  handler: ScheduledEventHandler,
  options: ScheduledEventOptions
) => () => {
  const context: ScheduledEventContext = {
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
