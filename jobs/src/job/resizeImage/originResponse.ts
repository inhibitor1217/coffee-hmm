import type { CloudFrontResponseEvent } from 'aws-lambda';
import { parse } from 'qs';
import { unescape } from 'querystring';
import resize, { ResizableFormat } from '../../services/resize';
import s3 from '../../services/s3';
import { cloudfrontResponseEventHandler } from '../../util/handler/cloudfrontEventHandler';
import { ILogger } from '../../util/logger';
import {
  ORIGIN_S3_BUCKET_NAME,
  isResizeAllowedContentType,
  ResizeAllowedContentType,
} from './const';
import { parseDimension } from './util';

const contentTypeToImageFormat: {
  [key in ResizeAllowedContentType]: ResizableFormat;
} = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

export const originResponse = async (
  event: CloudFrontResponseEvent,
  logger: ILogger
) => {
  const {
    Records: [
      {
        cf: { request, response },
      },
    ],
  } = event;
  const { uri, querystring } = request;
  const params = parse(querystring);
  const { d } = params;

  try {
    if (!d || typeof d !== 'string') {
      throw new TypeError('invalid dimension query param');
    }

    const dimension = parseDimension(d);

    const encodedObjectKey = uri.substr(1); // NOTE: /file.png -> file.png
    const objectKey = unescape(encodedObjectKey);

    const { body, contentType } = await s3.getFile({
      bucketName: ORIGIN_S3_BUCKET_NAME,
      fileName: objectKey,
    });

    if (!body || !(body instanceof Buffer)) {
      throw new TypeError('invalid response');
    }

    if (!isResizeAllowedContentType(contentType)) {
      throw new TypeError(
        `not allowed content type: ${contentType ?? 'unspecified'}`
      );
    }

    const resizedImage = await resize.run(
      body,
      dimension,
      contentTypeToImageFormat[contentType]
    );

    return {
      result: {
        ...response,
        body: resizedImage.toString('base64'),
        bodyEncoding: 'base64' as const,
      },
      body: {
        requestUri: uri,
        dimension,
      },
    };
  } catch (e) {
    logger.error(e);

    return {
      result: response,
      body: null,
    };
  }
};

export const handler = cloudfrontResponseEventHandler(
  ({ event, logger }) => originResponse(event, logger),
  {
    name: 'resizeImage/originResponse',
  }
);
