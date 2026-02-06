import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUploadCommand } from './create-upload.command';
import { Inject } from '@nestjs/common';
import type { StoragePort } from '../../ports/storage.port';
import { STORAGE_PORT } from '../../ports/storage.port';
import { UploadContract } from '../../domain/upload-contract.entity';

@CommandHandler(CreateUploadCommand)
export class CreateUploadHandler implements ICommandHandler<CreateUploadCommand> {
  constructor(
    @Inject(STORAGE_PORT)
    private readonly storagePort: StoragePort
  ) {}

  async execute(command: CreateUploadCommand): Promise<UploadContract | null> {
    const { userId, extension } = command;
    if (!userId) {
      throw new Error('UNAUTHORIZED, User ID is required');
    }

    return this.storagePort.createUploadUrl(userId, extension);
  }
}
