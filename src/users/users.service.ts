import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Like, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/UpdateUserDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: UpdateUserDto): Promise<User> {
    const { password } = createUserDto;
    const user = this.userRepository.create({
      ...createUserDto,
      password: await this.hashPassword(password),
    });
    return this.userRepository.save(user);
  }

  async findOne(id1: string, id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found.`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    return user;
  }

  async findMany(query: string): Promise<User[]> {
    return await this.userRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }

  async find(conditions: any): Promise<User[]> {
    return this.userRepository.find(conditions);
  }

  async findWishesByUserId(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      relations: { wishes: true },
      where: { id },
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    await this.userRepository.update(id, updateUserDto);
  }

  async removeOne(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(
    newPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(newPassword, passwordHash);
  }
}
