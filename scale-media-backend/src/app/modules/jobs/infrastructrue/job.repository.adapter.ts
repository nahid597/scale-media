import { Injectable } from '@nestjs/common';
import { JobRepositoryPort } from '../ports/job.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from './job.orm-entity';
import { Repository } from 'typeorm';
import { Job } from '../domain/job.entity';

@Injectable()
export class JobRepositoryAdapter implements JobRepositoryPort {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepo: Repository<JobEntity>
  ) {}

  async save(job: Job): Promise<Job | void> {
    const ormEntity = this.jobRepo.create(job);
    const savedEntity = await this.jobRepo.save(ormEntity);
    return new Job(
      savedEntity.id,
      savedEntity.fileKey,
      savedEntity.status,
      savedEntity.progress,
      savedEntity.createdAt,
      savedEntity.updatedAt
    );
  }

  async findAll(): Promise<Job[] | null> {
    const jobs = await this.jobRepo.find();
    if (jobs.length === 0) {
      return null;
    }
    return jobs.map(
      job => new Job(job.id, job.fileKey, job.status, job.progress, job.createdAt, job.updatedAt)
    );
  }

  async saveJobProgress(jobId: string, progress: number): Promise<void | Job> {
    const job = await this.jobRepo.findOne({ where: { id: jobId } });

    if (!job) {
      return;
    }

    // update only progress field
    const updatedJob = await this.jobRepo.preload({
      id: jobId,
      progress: progress,
    });

    if (!updatedJob) {
      return;
    }

    await this.jobRepo.save(updatedJob);
    return new Job(
      updatedJob.id,
      updatedJob.fileKey,
      updatedJob.status,
      updatedJob.progress,
      updatedJob.createdAt,
      updatedJob.updatedAt
    );
  }

  async findById(jobId: string): Promise<Job | null> {
    const job = await this.jobRepo.findOne({ where: { id: jobId } });
    if (!job) {
      return null;
    }
    return new Job(job.id, job.fileKey, job.status, job.progress, job.createdAt, job.updatedAt);
  }
}
