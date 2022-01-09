import type { CloudFrontRequestEvent } from 'aws-lambda';
import { cloudfrontRequestEventHandler } from '../../util/handler/cloudfrontEventHandler';
import { USER_AGENT_BOT_REGEX } from './const';

export const viewerRequest = (event: CloudFrontRequestEvent) => {
  const {
    Records: [
      {
        cf: { request },
      },
    ],
  } = event;
  const userAgent = request.headers['user-agent'][0].value.toLowerCase();

  if (userAgent && USER_AGENT_BOT_REGEX.test(userAgent)) {
    request.headers['is-crawler'] = [
      {
        key: 'is-crawler',
        value: 'true',
      },
    ];
  }

  return Promise.resolve({ result: request, body: null });
};

export const handler = cloudfrontRequestEventHandler(
  ({ event }) => viewerRequest(event),
  {
    name: 'appOpenGraph/viewerRequest',
  }
);
