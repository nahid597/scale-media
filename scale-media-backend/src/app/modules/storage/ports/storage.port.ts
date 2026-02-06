import { UploadContract } from '../domain/upload-contract.entity';

export const STORAGE_PORT = Symbol('STORAGE_PORT');

export interface StoragePort {
  createUploadUrl(userId: string, extension: string): Promise<UploadContract | null>;
}
