import S3Service from '../services/s3';
import { generateSitemap } from './generateSitemap';

S3Service.uploadFile = jest.fn();

describe('generateSitemap', () => {
  it('It completes with status 200', async () => {
    const [status] = await generateSitemap();

    expect(status).toBe(200);
  });
});
