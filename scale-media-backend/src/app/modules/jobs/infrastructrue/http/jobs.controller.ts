import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateJobCommand } from '../../application/commands/create-job.command';
import { UpdateJobProgressCommand } from '../../application/commands/update-job-progress.command';
import { GetAllJobsQuery } from '../../application/queries/get-all-jobs.query';

@Controller('jobs')
export class JobsController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  async createJob(@Body('fileKey') fileKey: string) {
    const job = await this.commandBus.execute(new CreateJobCommand(fileKey));
    return job;
  }

  @Patch(':id/progress')
  async updateJobProgress(@Param('id') id: string, @Body('progress') progress: number) {
    await this.commandBus.execute(new UpdateJobProgressCommand(id, progress));

    return { message: `Job ${id} progress updated to ${progress}` };
  }

  @Get()
  async getAllJobs() {
    return await this.queryBus.execute(new GetAllJobsQuery());
  }
}
