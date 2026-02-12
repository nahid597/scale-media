import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { MEDIA_JOB_QUEUE_NAME } from './const.type';

@Injectable()
export class JobQueueService {
  constructor(@InjectQueue(MEDIA_JOB_QUEUE_NAME) private readonly mediaProcessingQueue: Queue) {}

  async enQueueJob(jobId: string) {
    await this.mediaProcessingQueue.add(
      'process-media',
      { jobId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000, // 5 seconds
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
  }
}
