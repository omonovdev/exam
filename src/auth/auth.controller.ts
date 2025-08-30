import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('superadmin-login')
  async superadminLogin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.superadminLogin(email, password);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('doctor-login')
  async doctorLogin(@Body() body: { email: string; password: string }) {
    return this.authService.doctorLogin(body.email, body.password);
  }
}
