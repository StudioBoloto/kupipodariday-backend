import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../users/dto/UpdateUserDto';
import { User } from '../users/entity/user.entity';
import { SigninUserDto } from '../users/dto/SigninUserDto';
import { SigninUserResponseDto } from '../users/dto/SigninUserResponseDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(signinUserDto: SigninUserDto): Promise<any> {
    const user = await this.usersService.findOneByUsername(
      signinUserDto.username,
    );
    if (
      user &&
      (await this.usersService.comparePasswords(
        signinUserDto.password,
        user.password,
      ))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<SigninUserResponseDto> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(createUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersService.create(createUserDto);
    delete user.password;
    return user;
  }
}
