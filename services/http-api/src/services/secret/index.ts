import SsmSecretStorage from './ssm';

export default interface SecretStorage {
  /**
   * This retrieves per-application secret value.
   */
  get(key: string): Promise<string>;

  /**
   * This retrieves a global secret value.
   */
  getGlobal(key: string): Promise<string>;
}

export const getSecretStorage: () => SecretStorage = (() => {
  let instance: SecretStorage | undefined;

  return () => {
    if (!instance) {
      instance = new SsmSecretStorage();
    }
    return instance;
  };
})();
