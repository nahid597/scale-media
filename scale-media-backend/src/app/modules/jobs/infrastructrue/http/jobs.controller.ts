import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateJobProgressCommand } from '../../application/commands/update-job-progress.command';
import { GetAllJobsQuery } from '../../application/queries/get-all-jobs.query';
import { ConfirmUploadCommand } from '../../application/commands/confirm-upload.command';
import { Job } from '../../domain/job.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post('/upload/confirm')
  async createJob(@Body() body: Job): Promise<Job | { message: string }> {
    const { uploadId, fileKey, userId, metadata } = body;
    if (!uploadId || !fileKey || !userId) {
      return { message: 'uploadId, fileKey and userId are required' };
    }
    const jobId = crypto.randomUUID();
    const job = await this.commandBus.execute(
      new ConfirmUploadCommand(jobId, uploadId, fileKey, userId, metadata)
    );
    return job;
  }

  @Patch('/:id/progress')
  async updateJobProgress(@Param('id') id: string, @Body('progress') progress: number) {
    await this.commandBus.execute(new UpdateJobProgressCommand(id, progress));

    return { message: `Job ${id} progress updated to ${progress}` };
  }

  @Get()
  async getAllJobs() {
    return await this.queryBus.execute(new GetAllJobsQuery());
  }
}
