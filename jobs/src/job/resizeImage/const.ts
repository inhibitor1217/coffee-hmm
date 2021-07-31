import Dimension from '../../types/dimension';

export const ORIGIN_S3_BUCKET_NAME = 'test.resource.coffee-hmm.inhibitor.io';

export const RESIZE_ALLOWED_CONTENT_TYPE = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

export type ResizeAllowedContentType = 'image/png' | 'image/jpg' | 'image/jpeg';

export function isResizeAllowedContentType(
  contentType?: string
): contentType is ResizeAllowedContentType {
  if (!contentType) {
    return false;
  }

  return RESIZE_ALLOWED_CONTENT_TYPE.includes(contentType);
}

export const RESIZE_ALLOWED_DIMENSIONS: Dimension[] = [
  { width: 128, height: 128 },
  { width: 256, height: 256 },
  { width: 512, height: 512 },
  { width: 1024, height: 1024 },
];
