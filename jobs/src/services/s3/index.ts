import { S3 } from 'aws-sdk';

class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3();
  }

  async uploadFile(
    content: string,
    options: {
      bucketName: string;
      fileName: string;
      contentType?: string;
    }
  ): Promise<void> {
    return new Promise<void>((resolve, reject) =>
      this.s3.putObject(
        {
          Bucket: options.bucketName,
          Key: options.fileName,
          Body: content,
          ContentType: options.contentType,
        },
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      )
    );
  }
}

export default new S3Service();
