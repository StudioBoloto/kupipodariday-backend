import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateUserDto } from '../users/dto/UpdateUserDto';
import { LocalGuard } from './local.guard';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    this.logger.log('Received signin request for user: ' + req.user.id);
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: UpdateUserDto) {
    this.logger.log(
      'Received signup request with data: ' + JSON.stringify(createUserDto),
    );
    return this.authService.register(createUserDto);
  }
}
