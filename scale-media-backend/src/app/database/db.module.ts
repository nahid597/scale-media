import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfig } from '../config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...dbConfig,
        autoLoadEntities: true,
        synchronize: true, // Note: set to false in production
      }),
    }),
  ],
})
export class DatabaseModule {}
