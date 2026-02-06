import { Injectable } from '@nestjs/common';
import { StoragePort } from '../ports/storage.port';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UploadContract } from '../domain/upload-contract.entity';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SecretsService } from '../../../config/secrets.service';

@Injectable()
export class S3StorageAdapter implements StoragePort {
  private readonly expireIn = 60 * 10; // 10 minutes
  private readonly s3Client: S3Client;

  constructor(private readonly secretsService: SecretsService) {
    const credentials = this.secretsService.getAWSCredentials();
    this.s3Client = new S3Client({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });
  }

  async createUploadUrl(userId: string, extension: string): Promise<UploadContract | null> {
    const objectKey = this.buildKey(userId, extension);
    const command = new PutObjectCommand({
      Bucket: this.secretsService.getS3BucketName(),
      Key: objectKey,
      ContentType: this.mime(extension),
      Metadata: {
        userId,
        uploadAt: Date.now().toString(),
      },
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: this.expireIn });

    return new UploadContract(uploadUrl, objectKey, this.expireIn);
  }

  private buildKey(userId: string, extension: string): string {
    const timestamp = Date.now();
    return `${userId}/${timestamp}.${extension}`;
  }

  private mime(extension: string): string {
    const map: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp',
      webp: 'image/webp',
      mp4: 'video/mp4',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',
    };

    return map[extension] || 'application/octet-stream';
  }
}
