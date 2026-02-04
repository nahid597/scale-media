import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/db.module';
import { join } from 'path';
import { UserModule } from './modules/users/user.module';
import { JobModule } from './modules/jobs/job.module';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '..', '..', '..', '.env'),
    }),
    DatabaseModule,
    UserModule,
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
