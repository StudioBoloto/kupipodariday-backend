import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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

  async getWishWithRaised(wishId: number) {
    return this.wishRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.offers', 'offer')
      .select('wish.*')
      .addSelect('SUM(offer.amount)', 'wish_raised')
      .where('wish.id = :wishId', { wishId })
      .groupBy('wish.id')
      .getRawOne();
  }
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

  async updateOne(
    id: number,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<void> {
    const wish = await this.wishRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'You cannot change the price if there are already people willing to raise in',
      );
    }
    if (user.id !== wish.owner.id) {
      throw new BadRequestException('You do not own this wish.');
    }

    await this.wishRepository.update(id, updateWishDto);
  }

  async removeOne(id: number, user: User): Promise<void> {
    const wish = await this.wishRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (user.id !== wish.owner.id) {
      throw new BadRequestException('You do not own this wish.');
    }
    await this.wishRepository.remove(wish);
  }

  async copyOne(id: number, user: User): Promise<void> {
    const wish = await this.wishRepository.findOne({
      where: { id },
    });
    wish.owner = user;
    delete wish.id;
    await this.wishRepository.save(wish);
  }
}
