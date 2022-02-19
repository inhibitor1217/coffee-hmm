import type { CloudFrontRequestEvent } from 'aws-lambda';
import { cloudfrontRequestEventHandler } from '../../util/handler/cloudfrontEventHandler';
import { ILogger } from '../../util/logger';
import { USER_AGENT_BOT_REGEX } from './const';

export const viewerRequest = (
  event: CloudFrontRequestEvent,
  logger: ILogger
) => {
  const {
    Records: [
      {
        cf: { request },
      },
    ],
  } = event;
  logger.info({ 'request.uri': request.uri });

  const userAgent = request.headers['user-agent'][0].value.toLowerCase();
  logger.info({ userAgent });

  if (userAgent) {
    const isCrawler = USER_AGENT_BOT_REGEX.test(userAgent);
    logger.info({ isCrawler });
    request.headers['is-crawler'] = [
      {
        key: 'is-crawler',
        value: isCrawler ? 'true' : 'false',
      },
    ];
  }

  return Promise.resolve({ result: request, body: null });
};

export const handler = cloudfrontRequestEventHandler(
  ({ event, logger }) => viewerRequest(event, logger),
  {
    name: 'appOpenGraph/viewerRequest',
  }
);
