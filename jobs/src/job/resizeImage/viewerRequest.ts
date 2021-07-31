import { ILogger } from '../../util/logger';
import cloudfrontEventHandler from '../../util/handler/cloudfrontEventHandler';

export const viewerRequest = (logger?: ILogger): Promise<[number, AnyJson]> => {
  logger?.info('hi');

  return Promise.resolve([200, null]);
};

export const handler = cloudfrontEventHandler(
  ({ logger }) => viewerRequest(logger),
  {
    name: 'resizeImage/viewerRequest',
  }
);
