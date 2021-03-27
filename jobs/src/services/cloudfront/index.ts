import { CloudFront } from 'aws-sdk';

class CloudfrontService {
  cloudfront: CloudFront;

  constructor() {
    this.cloudfront = new CloudFront();
  }

  async invalidateCache(distributionId: string, paths: string[]) {
    return new Promise<void>((resolve, reject) =>
      this.cloudfront.createInvalidation(
        {
          DistributionId: distributionId,
          InvalidationBatch: {
            CallerReference: `${Date.now()}`,
            Paths: {
              Quantity: paths.length,
              Items: paths,
            },
          },
        },
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      )
    );
  }
}

export default new CloudfrontService();
