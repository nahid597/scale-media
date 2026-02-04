import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetJobQuery } from './get-job.query';
import { Inject } from '@nestjs/common';
import { JOB_REPOSITORY } from '../../ports/job.repository.port';
import type { JobRepositoryPort } from '../../ports/job.repository.port';
import { Job } from '../../domain/job.entity';

@QueryHandler(GetJobQuery)
export class GetJobHandler implements IQueryHandler<GetJobQuery> {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort) {}

  execute(query: GetJobQuery): Promise<Job | null> {
    return this.jobRepository.findById(query.id);
  }
}
