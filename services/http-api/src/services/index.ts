import { getAuthService } from './auth';
import { getSecretStorage } from './secret';

const service = () => ({
  auth: getAuthService,
  secret: getSecretStorage,
});

export default service;
