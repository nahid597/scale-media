import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../domain/user.repository.port';
import type { UserRepositoryPort } from '../domain/user.repository.port';
import { User } from '../domain/user.entity';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort) {}

  async create(name: string, email: string): Promise<User> {
    // Validate input
    if (!name || !email) {
      throw new BadRequestException('Name and email are required');
    }

    // Check if user already exists
    const existingUsers = await this.userRepository.findAll();
    const userExists = existingUsers.some(u => u.email === email);
    
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      let user = new User(0, name, email);
      user = await this.userRepository.save(user);
      return { name: user.name, email: user.email, id: user.id };
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users;
  }

  async findById(id: number): Promise<User> {
    const users = await this.userRepository.findAll();
    const user = users.find(u => u.id === id);
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }
}
