import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  UnauthorizedException, 
  Get, 
  Patch, 
  Req, 
  ForbiddenException 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from './user.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin')
  @Roles(UserRole.SUPERADMIN)
  async createAdmin(
    @Body() body: { email: string; password: string }, 
    @Req() req: any
  ) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException('Email va password majburiy');
    }
    return this.usersService.createAdmin(body.email, body.password);
  }

  @Get('me')
  async getProfile(@Req() req) {
    if (!req.user) throw new ForbiddenException('No user found');
    return this.usersService.findByEmail(req.user.email);
  }

  @Patch('me')
  async updateProfile(@Req() req, @Body() body) {
    if (!req.user) throw new ForbiddenException('No user found');
    return this.usersService.updateUser(req.user.email, body);
  }

  @Get('all')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
