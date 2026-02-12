import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MEDIA_JOB_QUEUE_NAME } from './const.type';

@Processor(MEDIA_JOB_QUEUE_NAME)
export class MediaJobProcessor extends WorkerHost {
  private readonly logger = new Logger(MediaJobProcessor.name);

  async process(job: Job<{ jobId: string }>): Promise<void> {
    const { jobId } = job.data;

    this.logger.log(`[Job ${job.id}] Processing media job with ID: ${jobId}`);
  }
}
