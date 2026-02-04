import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllJobsQuery } from './get-all-jobs.query';
import { Inject } from '@nestjs/common';
import type { JobRepositoryPort } from '../../ports/job.repository.port';
import { JOB_REPOSITORY } from '../../ports/job.repository.port';
import { Job } from '../../domain/job.entity';

@QueryHandler(GetAllJobsQuery)
export class GetAllJobsHandler implements IQueryHandler<GetAllJobsQuery> {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort) {}

  execute(query: GetAllJobsQuery): Promise<Job[] | null> {
    return this.jobRepository.findAll();
  }
}
