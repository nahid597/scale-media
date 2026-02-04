import { User } from './user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

// If anyone want to communicate with User repository, they should depend on this port interface
export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findAll(): Promise<User[]>;
}
