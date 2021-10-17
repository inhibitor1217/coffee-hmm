import type { EventContext } from './event';

export interface SqsMessage {
  name: string;
  content: string;
}

export interface WrappedSqsMessageBody {
  Type: 'Notification';
  MessageId: string;
  SequenceNumber: string;
  TopicArn: string;
  Message: string;
  Timestamp: string;
  UnsubscribeURL: string;
}

export type SqsEventHandler = (
  context: EventContext,
  name: string,
  content: AnyJson
) => Promise<[number, AnyJson]>;
