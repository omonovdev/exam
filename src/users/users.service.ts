import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
    });
    return this.userRepository.save(user);
  }

  async createAdmin(email: string, password: string): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = this.userRepository.create({
        email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      return await this.userRepository.save(admin);
    } catch (error) {
      throw new NotFoundException('Admin yaratishda xatolik: ' + error.message);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUser(email: string, updateData: Partial<User>): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new Error('User not found');

      Object.assign(user, updateData);

      if (updateData.password) {
        user.password = await bcrypt.hash(updateData.password, 10);
      }

      return await this.userRepository.save(user);
    } catch (error) {
      throw new NotFoundException('User yangilashda xatolik: ' + error.message);
    }
  }
}
