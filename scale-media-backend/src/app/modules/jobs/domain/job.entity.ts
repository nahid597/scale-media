import { EJobStatus } from './job.status.enum';

export class Job {
  constructor(
    public id: string,
    public fileKey: string,
    public status: EJobStatus,
    public progress: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
