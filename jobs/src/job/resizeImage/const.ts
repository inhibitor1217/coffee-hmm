import Dimension from '../../types/dimension';

export const ORIGIN_S3_BUCKET_NAME = 'coffee-hmm-image';

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
  { width: 120, height: 120 },
  { width: 240, height: 240 },
  { width: 360, height: 360 },
  { width: 480, height: 480 },
  { width: 720, height: 720 },
];
