import { getSecretStorage } from './secret';

const service = () => ({
  secret: getSecretStorage,
});

export default service;
