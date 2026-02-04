import { Job } from '../domain/job.entity';

export const JOB_REPOSITORY = Symbol('JOB_REPOSITORY');

// If anyone want to communicate with Job repository, they should depend on this port interface
export interface JobRepositoryPort {
  save(job: Job): Promise<Job | void>;
  findAll(): Promise<Job[] | null>;
  findById(jobId: string): Promise<Job | null>;
  saveJobProgress(jobId: string, progress: number): Promise<Job | void>;
}
