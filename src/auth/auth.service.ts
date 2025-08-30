import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from '../workers/entities/worker.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
  ) { }

  async superadminLogin(email: string, password: string) {
    const superEmail = this.configService.get<string>('SUPERADMIN_EMAIL');
    const superPassword = this.configService.get<string>('SUPERADMIN_PASSWORD');

    if (email === superEmail && password === superPassword) {
      const payload = { sub: 'superadmin', email, role: UserRole.SUPERADMIN };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      });
      return { message: 'SuperAdmin login successful', access_token: token };
    }

    throw new UnauthorizedException('Invalid SuperAdmin credentials');
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = {
      fullname: registerDto.fullname,
      email: registerDto.email,
      password: hashedPassword,
      role: UserRole.ADMIN, // Register bo'lgan user default admin bo‘ladi
    };

    return this.usersService.createUser(newUser);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1d',
    });

    return { message: 'Login successful', access_token: token };
  }

  async doctorLogin(email: string, password: string) {
    // Doctor'ni Worker entity'dan topamiz
    const doctor = await this.workerRepository.findOne({
      where: { email },
      relations: ['hospital']
    });

    if (!doctor) {
      throw new UnauthorizedException('Doctor not found');
    }

    // Hozircha password'ni email bilan bir xil deb qabul qilamiz
    // Keyinchalik Worker entity'ga password field qo'shish mumkin
    const payload = {
      sub: doctor.id,
      email: doctor.email,
      role: 'DOCTOR',
      workerId: doctor.id,
      hospitalId: doctor.hospital_id
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1d',
    });

    return {
      message: 'Doctor login successful',
      access_token: token,
      doctor: {
        id: doctor.id,
        name: `${doctor.first_name} ${doctor.last_name}`,
        email: doctor.email,
        role: doctor.role,
        specialization: doctor.specialization,
        hospital_id: doctor.hospital_id
      }
    };
  }
}
