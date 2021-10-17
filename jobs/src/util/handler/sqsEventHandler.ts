import { Exception } from '@coffee-hmm/common';
import type { SQSEvent } from 'aws-lambda';
import { logLevel } from '..';
import type { EventContext, EventOptions } from '../../types/event';
import type {
  SqsEventHandler,
  SqsMessage,
  WrappedSqsMessageBody,
} from '../../types/sqs';
import { Logger } from '../logger';
import { formatJobCompleteMessage } from './util';

const formatSqsMessage = (messageId: string, name: string, timestamp: string) =>
  `Consume message ${messageId} [${name}] [${timestamp}]`;

const sqsEventHandler = (handler: SqsEventHandler, options: EventOptions) => (
  event: SQSEvent
) => {
  const context: EventContext = {
    logger: new Logger(logLevel()),
  };

  return Promise.all(
    event.Records.map(async (record) => {
      const { body } = record;
      const {
        MessageId: messageId,
        Message: message,
        Timestamp: timestamp,
      } = (JSON.parse(body) as unknown) as WrappedSqsMessageBody;
      const { name, content } = (JSON.parse(message) as unknown) as SqsMessage;

      context.logger.info(formatSqsMessage(messageId, name, timestamp));

      const [statusCode, result] = await handler(context, name, content);

      context.logger.info(
        formatJobCompleteMessage(options, statusCode, result)
      );

      if (statusCode >= 400) return Promise.reject(result);

      return Promise.resolve();
    })
  )
    .then(() => Promise.resolve({ statusCode: 200 }))
    .catch((e) => {
      context.logger.error(Exception.isException(e) ? e.message : e);
      return Promise.reject(e);
    });
};

export default sqsEventHandler;
