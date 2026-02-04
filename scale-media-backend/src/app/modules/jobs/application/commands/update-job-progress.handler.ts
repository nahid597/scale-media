import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateJobProgressCommand } from './update-job-progress.command';
import { Inject } from '@nestjs/common';
import { JOB_REPOSITORY } from '../../ports/job.repository.port';
import type { JobRepositoryPort } from '../../ports/job.repository.port';

@CommandHandler(UpdateJobProgressCommand)
export class UpdateJobProgressHandler implements ICommandHandler<UpdateJobProgressCommand> {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort) {}

  async execute(command: UpdateJobProgressCommand): Promise<any> {
    const job = await this.jobRepository.findById(command.id);
    if (!job) {
      throw new Error(`Job with id ${command.id} not found`);
    }
    return this.jobRepository.saveJobProgress(command.id, command.progress);
  }
}
