import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './app/worker.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('WorkerBootstrap');

  logger.log('🚀 Starting Media Processing Worker...');

  const app = await NestFactory.createApplicationContext(WorkerModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  logger.log('✅ Media Processing Worker is running and waiting for jobs...');

  // Keep the application running
  process.on('SIGTERM', async () => {
    logger.log('⚠️ SIGTERM signal received: closing worker gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('⚠️ SIGINT signal received: closing worker gracefully');
    await app.close();
    process.exit(0);
  });
}

bootstrap();
