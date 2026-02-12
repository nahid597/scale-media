import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './infrastructrue/job.orm-entity';
import { JOB_REPOSITORY } from './ports/job.repository.port';
import { JobRepositoryAdapter } from './infrastructrue/job.repository.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { GetJobHandler } from './application/queries/get-job.handler';
import { UpdateJobProgressHandler } from './application/commands/update-job-progress.handler';
import { JobsController } from './infrastructrue/http/jobs.controller';
import { GetAllJobsHandler } from './application/queries/get-all-jobs.handler';
import { ConfirmUploadHandler } from './application/commands/confirm-upload.handler';
import { QueueModule } from '../infrastructure/queue/queue.module';
const CommandHandlers = [ConfirmUploadHandler, UpdateJobProgressHandler];
const QueryHandlers = [GetJobHandler, GetAllJobsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity]), CqrsModule, QueueModule],
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
