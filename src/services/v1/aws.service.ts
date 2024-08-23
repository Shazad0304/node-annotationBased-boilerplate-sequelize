import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { awsConfig } from '@config';

export class AWSService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKey,
        secretAccessKey: awsConfig.secretKey,
      },
    });
  }

  async uploadImage(file: any, mimetype?: any): Promise<string> {
    if (!file || !file.originalname || !file.buffer || (mimetype && !file.mimetype)) {
      throw new Error('Invalid file object');
    }

    const filePath = `public/${file.originalname}`;
    const params = {
      Bucket: awsConfig.bucketName,
      ContentType: mimetype || file.mimetype,
      Key: filePath,
      Body: file.buffer,
    };

    const command = new PutObjectCommand(params);

    try {
      await this.s3Client.send(command);
      return `https://${awsConfig.bucketName}.s3.amazonaws.com/${filePath}`;
    } catch (error) {
      console.error('Error', error);
      throw error;
    }
  }
}