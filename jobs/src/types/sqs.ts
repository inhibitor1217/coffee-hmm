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
