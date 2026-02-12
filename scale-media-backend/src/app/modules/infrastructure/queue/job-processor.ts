// import { Processor } from '@nestjs/bullmq';
// import { MEDIA_JOB_QUEUE_NAME } from './const.type';
// import { Job } from 'bullmq';

// @Processor(MEDIA_JOB_QUEUE_NAME)
// export class JobProcessor {
//   async process(job: Job<{ jobId: string }>) {
//     const { jobId } = job.data;
//     console.log(`Processing job with ID: ${jobId}`);
//     // Here you would implement the logic to process the media file associated with the jobId
//     // For example:
//     // await this.mediaProcessingService.processMedia(jobId);
//   }
// }
