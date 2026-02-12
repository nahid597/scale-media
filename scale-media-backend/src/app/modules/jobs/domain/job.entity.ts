import { EJobStatus } from './job.status.enum';

export class Job {
  constructor(
    public id: string,
    public fileKey: string,
    public readonly uploadId: string,
    public status: EJobStatus = EJobStatus.PENDING,
    public progress = 0,
    public userId: string,
    public readonly metadata: Record<string, unknown> = {},
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
