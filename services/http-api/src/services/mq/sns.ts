import { SNS } from 'aws-sdk';
import { getSecretStorage } from '../secret';
import type MessageQueue from '.';

export default class SnsMessageQueue implements MessageQueue {
  private readonly sns: SNS;

  private static readonly DEFAULT_MESSAGE_GROUP = 'defaultMessageGroup';

  constructor() {
    this.sns = new SNS();
  }

  async publish(
    topic: string,
    name: string,
    content: AnyJson
  ): Promise<string> {
    const params: SNS.Types.PublishInput = {
      TopicArn: await SnsMessageQueue.getTopicResourceId(topic),
      Message: name,
      MessageAttributes: {
        content: SnsMessageQueue.mapJson(content),
      },
      MessageGroupId: SnsMessageQueue.DEFAULT_MESSAGE_GROUP,
    };

    return new Promise<string>((resolve, reject) => {
      this.sns.publish(params, (err, { MessageId: messageId }) => {
        if (err) reject(err);
        else if (!messageId)
          reject(new TypeError('AWS SNS publish returned an empty messageId'));
        else resolve(messageId);
      });
    });
  }

  /**
   * NOTE: should implement this with smarter mechanism
   * rather than stringifying whole content, `MessageAttributeMap` could be generated here
   */
  private static mapJson(json: AnyJson): SNS.Types.MessageAttributeValue {
    return {
      DataType: 'String',
      StringValue: JSON.stringify(json),
    };
  }

  private static getTopicResourceId(topic: string): Promise<string> {
    return getSecretStorage().getGlobal(`topic.${topic}`);
  }
}
