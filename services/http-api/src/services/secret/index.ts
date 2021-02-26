import SsmSecretStorage from './ssm';

export default interface SecretStorage {
  get(key: string): Promise<string>;
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
