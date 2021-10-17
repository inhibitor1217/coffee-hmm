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
      Message: JSON.stringify({ name, content }),
      MessageGroupId: SnsMessageQueue.DEFAULT_MESSAGE_GROUP,
    };

    return new Promise<string>((resolve, reject) => {
      this.sns.publish(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const { MessageId: messageId } = data ?? {};

        if (!messageId) {
          reject(new TypeError('AWS SNS publish returned an empty messageId'));
          return;
        }

        resolve(messageId);
      });
    });
  }

  private static getTopicResourceId(topic: string): Promise<string> {
    return getSecretStorage().getGlobal(`topic.${topic}`);
  }
}
