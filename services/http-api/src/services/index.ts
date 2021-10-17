import { getAuthService } from './auth';
import { getMessageQueue } from './mq';
import { getSecretStorage } from './secret';

const service = () => ({
  auth: getAuthService,
  mq: getMessageQueue,
  secret: getSecretStorage,
});

export default service;
