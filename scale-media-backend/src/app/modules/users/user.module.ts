import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/user.orm-entity';
import { UserService } from './application/user.service';
import { USER_REPOSITORY } from './domain/user.repository.port';
import { UserRepositoryAdapter } from './infrastructure/user.repository.adapter';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryAdapter,
    },
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
