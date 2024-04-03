import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/auth.guard';
import { WishesService } from '../wishes/wishes.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Req() req) {
    const { password, ...rest } = await this.usersService.findOne(
      'id',
      req.user.id,
    );
    return rest;
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getMeWishes(@Req() req) {
    const user = await this.usersService.findWishesByUserId(req.user.id);
    return user?.wishes || [];
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  getUser(@Param('username') username) {
    return this.usersService.findOneByUsername(username);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getUsersWishes(@Param('username') username) {
    return this.wishesService.findManyByOwner(username);
  }

  @Post('find')
  findUsers(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
}
