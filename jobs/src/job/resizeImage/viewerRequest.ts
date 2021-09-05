import type { CloudFrontRequest, CloudFrontRequestEvent } from 'aws-lambda';
import { parse, stringify } from 'qs';
import { cloudfrontRequestEventHandler } from '../../util/handler/cloudfrontEventHandler';
import Dimension from '../../types/dimension';
import { RESIZE_ALLOWED_DIMENSIONS } from './const';
import { formatDimension, parseDimension, stringifyDimension } from './util';

function formatBody(
  request: CloudFrontRequest,
  dimension?: Dimension
): AnyJson {
  return {
    uri: request.uri,
    dimension: dimension
      ? formatDimension(dimension)
      : 'no dimension specified or dimension param is invalid',
  };
}

export const viewerRequest = (
  event: CloudFrontRequestEvent,
  allowedDimensions: Dimension[]
) => {
  const {
    Records: [
      {
        cf: { request },
      },
    ],
  } = event;
  const { querystring } = request;
  const params = parse(querystring);
  const { d } = params;

  try {
    if (!d) {
      throw new TypeError('no dimension');
    }

    if (typeof d !== 'string') {
      throw new TypeError('param.d should be string');
    }

    const dimension = parseDimension(d);

    if (
      !allowedDimensions.some(
        (allowed) =>
          allowed.width === dimension.width &&
          allowed.height === dimension.height
      )
    ) {
      throw new TypeError('requested dimension is not allowed');
    }

    return Promise.resolve({
      result: {
        ...request,
        querystring: stringify({ d: stringifyDimension(dimension) }),
      },
      body: formatBody(request, dimension),
    });
  } catch (e) {
    // NOTE: no dimension is specified, or dimension parameter is in invalid format
    // forward request as is in this case

    return Promise.resolve({
      result: { ...request, querystring: '' },
      body: formatBody(request),
    });
  }
};

export const handler = cloudfrontRequestEventHandler(
  ({ event }) => viewerRequest(event, RESIZE_ALLOWED_DIMENSIONS),
  {
    name: 'resizeImage/viewerRequest',
  }
);
