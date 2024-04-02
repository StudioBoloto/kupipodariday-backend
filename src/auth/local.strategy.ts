import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from '../users/dto/SigninUserDto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username' });
  }

  async validate(signinUserDto: SigninUserDto): Promise<any> {
    const user = await this.authService.validateUser(signinUserDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
