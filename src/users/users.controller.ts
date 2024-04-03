import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Req() req) {
    const { password, ...rest } = await this.usersService.findOne(
      'id',
      req.user.id,
    );
    return rest;
  }
}
