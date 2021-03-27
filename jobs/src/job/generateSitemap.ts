import ApiService from '../services/api';
import S3Service from '../services/s3';
import SitemapService from '../services/sitemap';
import { env } from '../util';
import Logger from '../util/logger';
import scheduledEventHandler from '../util/scheduledEventHandler';

const SITEMAP_FILENAME = 'sitemap.xml';

function getCafeDetailPageSubUrl(cafeId: string) {
  return `/cafe/${cafeId}`;
}

export const generateSitemap = async (
  logger?: Logger
): Promise<[number, AnyJson]> => {
  const cafes = await ApiService.getAllCafes();

  logger?.info(`Found ${cafes.length} cafes.`);

  const cafeIds = cafes.map((cafe) => cafe.id);
  const cafeDetailSubUrls = cafeIds.map(getCafeDetailPageSubUrl);
  const sitemapStr = SitemapService.generate(cafeDetailSubUrls);

  await S3Service.uploadFile(sitemapStr, {
    bucketName: env('SPA_S3_BUCKET_NAME'),
    fileName: SITEMAP_FILENAME,
  });

  logger?.info(
    `Uploaded ${SITEMAP_FILENAME} to S3 bucket ${env('SPA_S3_BUCKET_NAME')}`
  );

  return [200, null];
};

export const handler = scheduledEventHandler(
  ({ logger }) => generateSitemap(logger),
  {
    name: 'generateSitemap',
  }
);
