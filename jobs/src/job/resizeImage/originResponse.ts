import type { CloudFrontResponseEvent } from 'aws-lambda';
import { parse } from 'qs';
import { cloudfrontResponseEventHandler } from '../../util/handler/cloudfrontEventHandler';
import { parseDimension } from './util';

export const originResponse = (event: CloudFrontResponseEvent) => {
  const {
    Records: [
      {
        cf: { request, response },
      },
    ],
  } = event;
  const { querystring } = request;
  const params = parse(querystring);
  const { d } = params;

  if (!d) {
    return Promise.resolve({
      result: response,
      body: null,
    });
  }

  if (typeof d !== 'string') {
    throw new TypeError('invalid dimension query param');
  }

  const dimension = parseDimension(d);

  return Promise.resolve({
    result: response,
    body: dimension,
  });
};

export const handler = cloudfrontResponseEventHandler(
  ({ event }) => originResponse(event),
  {
    name: 'resizeImage/originResponse',
  }
);
