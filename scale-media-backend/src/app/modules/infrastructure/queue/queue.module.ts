import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { MEDIA_JOB_QUEUE_NAME } from './const.type';
import { JobQueueService } from './job-queue.service';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    BullModule.registerQueue({
      name: MEDIA_JOB_QUEUE_NAME,
    }),
  ],
  providers: [JobQueueService],
  exports: [JobQueueService],
})
export class QueueModule {}
