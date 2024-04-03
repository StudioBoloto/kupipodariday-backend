import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateWishlistDto } from './dto/CreateWishlistDto';
import { Wishlist } from './entity/wishlist.entity';
import { User } from '../users/entity/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  private appErrors: any;
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      user,
    });
    if (createWishlistDto.itemsId) {
      wishlist.items = [];
      for (const itemId of createWishlistDto.itemsId) {
        const item = await this.wishesService.findOne(itemId);
        wishlist.items.push(item);
      }
    }
    return await this.wishlistRepository.save(wishlist);
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      relations: { items: true },
      where: { id },
    });
  }

  async findAll() {
    return await this.wishlistRepository.find({
      relations: { items: true },
    });
  }

  async find(conditions: any): Promise<Wishlist[]> {
    return this.wishlistRepository.find(conditions);
  }

  async updateOne(
    id: number,
    updateWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      relations: { user: true, items: true },
      where: { id },
    });

    if (!wishlist) {
      throw new BadRequestException('Wishlist not found.');
    }

    if (user.id !== wishlist.user.id) {
      throw new BadRequestException('You do not own this wishlist.');
    }

    if (updateWishlistDto.itemsId) {
      wishlist.items = await this.wishesService.findManyById(
        updateWishlistDto.itemsId,
      );
    }

    wishlist.name = updateWishlistDto.name ?? wishlist.name;
    wishlist.image = updateWishlistDto.image ?? wishlist.image;

    await this.wishlistRepository.save(wishlist);

    return this.wishlistRepository.findOne({
      where: { id },
      relations: { user: true, items: true },
    });
  }

  async removeOne(id: number, owner: User): Promise<void> {
    const wishlist = await this.findOne(id);
    if (owner.id !== wishlist.user.id) {
      throw new BadRequestException(this.appErrors.WRONG_DATA);
    }
    await this.wishlistRepository.delete(wishlist);
  }
}
