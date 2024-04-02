import { BadRequestException, Injectable } from '@nestjs/common';
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
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: UpdateUserDto): Promise<User> {
    const userByUsername = await this.usersService.findOneByUsername(
      createUserDto.username,
    );
    if (userByUsername) {
      throw new BadRequestException('User with this username already exists');
    }

    const userByEmail = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (userByEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    return this.usersService.create(createUserDto);
  }
}
