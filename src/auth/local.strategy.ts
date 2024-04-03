import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from '../users/dto/SigninUserDto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string): Promise<any> {
    const signinUserDto = plainToInstance(SigninUserDto, {
      username,
      password,
    });

    const errors = await validate(signinUserDto);
    if (errors.length > 0) {
      throw new UnauthorizedException('Validation failed');
    }

    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
