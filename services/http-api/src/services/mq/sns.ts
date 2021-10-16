import type MessageQueue from '.';

export default class SnsMessageQueue implements MessageQueue {
  async publish(
    topic: string,
    name: string,
    content: AnyJson
  ): Promise<string> {
    return Promise.reject(new Error('not implemented'));
  }
}
