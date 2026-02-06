import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

interface AWSSecrets {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION?: string;
  AWS_S3_BUCKET_NAME?: string;
}

@Injectable()
export class SecretsService implements OnModuleInit {
  private readonly logger = new Logger(SecretsService.name);
  private secrets: AWSSecrets | null = null;
  private useSecretsManager: boolean;
  private secretsManagerClient: SecretsManagerClient | null = null;

  constructor() {
    // Check if we should use AWS Secrets Manager
    this.useSecretsManager = !!process.env.AWS_SECRETS_MANAGER_SECRET_NAME;

    if (this.useSecretsManager) {
      this.secretsManagerClient = new SecretsManagerClient({
        region: process.env.AWS_REGION || 'ap-south-1',
      });
    }
  }

  async onModuleInit() {
    if (this.useSecretsManager) {
      await this.loadSecretsFromSecretsManager();
    }
  }

  private async loadSecretsFromSecretsManager(): Promise<void> {
    try {
      const command = new GetSecretValueCommand({
        SecretId: process.env.AWS_SECRETS_MANAGER_SECRET_NAME,
      });

      const response = await this.secretsManagerClient!.send(command);

      if (response.SecretString) {
        this.secrets = JSON.parse(response.SecretString) as AWSSecrets;
        this.logger.log('✓ AWS secrets loaded from Secrets Manager');
      }
    } catch (error) {
      this.logger.error('Failed to load secrets from AWS Secrets Manager:', error);
      throw new Error('Failed to initialize AWS credentials');
    }
  }

  getAWSCredentials() {
    if (this.useSecretsManager && this.secrets) {
      return {
        accessKeyId: this.secrets.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.secrets.AWS_SECRET_ACCESS_KEY,
        region: this.secrets.AWS_REGION || process.env.AWS_REGION,
      };
    }

    // Fallback to environment variables (for local development)
    return {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      region: process.env.AWS_REGION,
    };
  }

  getS3BucketName(): string {
    if (this.useSecretsManager && this.secrets?.AWS_S3_BUCKET_NAME) {
      return this.secrets.AWS_S3_BUCKET_NAME;
    }
    return process.env.AWS_S3_BUCKET_NAME!;
  }

  isUsingSecretsManager(): boolean {
    return this.useSecretsManager;
  }
}
