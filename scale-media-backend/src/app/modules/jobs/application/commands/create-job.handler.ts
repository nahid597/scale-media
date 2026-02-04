import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateJobCommand } from './create-job.command';
import { Inject } from '@nestjs/common';
import { JOB_REPOSITORY } from '../../ports/job.repository.port';
import type { JobRepositoryPort } from '../../ports/job.repository.port';
import { Job } from '../../domain/job.entity';
import { EJobStatus } from '../../domain/job.status.enum';

@CommandHandler(CreateJobCommand)
export class CreateJobHandler implements ICommandHandler<CreateJobCommand> {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort) {}

  async execute(command: CreateJobCommand): Promise<Job> {
    const job = new Job(
      crypto.randomUUID(),
      command.fileKey,
      EJobStatus.PENDING,
      0,
      new Date(),
      new Date()
    );
    await this.jobRepository.save(job);
    return job;
  }
}
