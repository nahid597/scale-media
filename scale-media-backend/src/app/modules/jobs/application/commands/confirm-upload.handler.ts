import { Inject } from '@nestjs/common';
import { JOB_REPOSITORY, type JobRepositoryPort } from '../../ports/job.repository.port';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmUploadCommand } from './confirm-upload.command';
import { Job } from '../../domain/job.entity';
import { EJobStatus } from '../../domain/job.status.enum';
import { JobQueueService } from '../../../infrastructure/queue/job-queue.service';

@CommandHandler(ConfirmUploadCommand)
export class ConfirmUploadHandler implements ICommandHandler<ConfirmUploadCommand> {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: JobRepositoryPort,
    private readonly jobQueueService: JobQueueService
  ) {}

  async execute(command: ConfirmUploadCommand) {
    const job = new Job(
      command.jobId,
      command.fileKey,
      command.uploadId,
      EJobStatus.PENDING,
      0,
      command.userId,
      command.metadata
    );
    await this.jobRepository.save(job);

    // added queue job here for processing the uploaded file
    await this.jobQueueService.enQueueJob(job.id);
    console.log(`Enqueued job with ID: ${job.id} for processing`);

    return {
      message: 'Upload confirmed and job created successfully',
      jobId: job.id,
      status: job.status,
    };
  }
}
