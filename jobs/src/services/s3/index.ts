import { S3 } from 'aws-sdk';
import type { Body } from 'aws-sdk/clients/s3';

class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3();
  }

  async getFile(options: {
    bucketName: string;
    fileName: string;
  }): Promise<{ body?: Body; contentType?: string }> {
    return new Promise<{ body?: Body; contentType?: string }>(
      (resolve, reject) =>
        this.s3.getObject(
          {
            Bucket: options.bucketName,
            Key: options.fileName,
          },
          (err, data) => {
            if (err) reject(err);
            else resolve({ body: data.Body, contentType: data.ContentType });
          }
        )
    );
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
