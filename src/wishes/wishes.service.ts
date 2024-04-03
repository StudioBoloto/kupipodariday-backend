import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wish } from './entity/wish.entity';
import { CreateWishDto } from './dto/CreateWishDto';
import { UpdateWishDto } from './dto/UpdateWishDto';
import { User } from '../users/entity/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const wish = this.wishRepository.create({ ...createWishDto, owner });
    return this.wishRepository.save(wish);
  }

  async findOne(id: number): Promise<Wish> {
    return this.wishRepository.findOne({
      relations: { owner: true, offers: { user: true } },
      where: { id },
    });
  }

  async find(conditions: any): Promise<Wish[]> {
    return this.wishRepository.find(conditions);
  }

  async findManyByKey(
    orderBy: { [key: string]: 'ASC' | 'DESC' },
    take: number,
  ): Promise<Wish[]> {
    return this.wishRepository.find({
      order: orderBy,
      take: take,
    });
  }

  async findManyById(ids: number[]) {
    return await this.wishRepository.findBy({
      id: In(ids),
    });
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto): Promise<void> {
    await this.wishRepository.update(id, updateWishDto);
  }

  async removeOne(id: number): Promise<void> {
    await this.wishRepository.delete(id);
  }
}
