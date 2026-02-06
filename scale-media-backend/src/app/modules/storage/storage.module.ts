import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StorageController } from './infrastructure/http/storage.controller';
import { CreateUploadHandler } from './application/command/create-upload.handler';
import { STORAGE_PORT } from './ports/storage.port';
import { S3StorageAdapter } from './infrastructure/s3-storage.adapter';
import { SecretsService } from '../../config/secrets.service';

@Module({
  imports: [CqrsModule],
  controllers: [StorageController],
  providers: [
    SecretsService,
    CreateUploadHandler,
    {
      provide: STORAGE_PORT,
      useClass: S3StorageAdapter,
    },
  ],
})
export class StorageModule {}
