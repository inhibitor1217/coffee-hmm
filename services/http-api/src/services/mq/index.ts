export default interface MessageQueue {
  /**
   * Publishes a message using the implementation class (i.e. AWS SNS).
   *
   * @param topic This is the unique identifier for topic, which is typically a name of the domain. (e.g. `"cafe"`) `topic` parameter is vender-independent. The implemention of this interface would find the resource identifier from given topic, and setup the message queue environment on its own.
   * @param name Message name.
   * @param content Message content. The implementing class has responsibility to format the message and execute the vendor-specific API.
   * @returns A promise which resolves to published message id. Rejects if the publishing failed with according error.
   */
  publish(topic: string, name: string, content: AnyJson): Promise<string>;
}

export const getMessageQueue: () => MessageQueue = (() => {
  return () => {
    throw new Error('not implemented');
  };
})();
