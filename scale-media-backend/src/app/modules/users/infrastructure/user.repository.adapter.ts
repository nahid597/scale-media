import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../domain/user.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>
  ) {}

  async save(user: User): Promise<User> {
    const ormEntity = this.userRepo.create(user);
    const savedEntity = await this.userRepo.save(ormEntity);
    return new User(savedEntity.id, savedEntity.name, savedEntity.email);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepo.find();
    return users.map(user => new User(user.id, user.name, user.email));
  }
}
