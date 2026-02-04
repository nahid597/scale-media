import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './infrastructrue/job.orm-entity';
import { JOB_REPOSITORY } from './ports/job.repository.port';
import { JobRepositoryAdapter } from './infrastructrue/job.repository.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateJobHandler } from './application/commands/create-job.handler';
import { GetJobHandler } from './application/queries/get-job.handler';
import { UpdateJobProgressHandler } from './application/commands/update-job-progress.handler';
import { JobsController } from './infrastructrue/http/jobs.controller';
import { GetAllJobsHandler } from './application/queries/get-all-jobs.handler';
const CommandHandlers = [CreateJobHandler, UpdateJobProgressHandler];
const QueryHandlers = [GetJobHandler, GetAllJobsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity]), CqrsModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: JOB_REPOSITORY,
      useClass: JobRepositoryAdapter,
    },
  ],
  exports: [],
  controllers: [JobsController],
})
export class JobModule {}
