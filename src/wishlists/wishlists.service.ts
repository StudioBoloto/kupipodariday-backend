import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateWishlistDto } from './dto/CreateWishlistDto';
import { Wishlist } from './entity/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const wishlist = this.wishlistRepository.create(createWishlistDto);
    return this.wishlistRepository.save(wishlist);
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({ where: { id } });
  }

  async find(conditions: any): Promise<Wishlist[]> {
    return this.wishlistRepository.find(conditions);
  }

  async updateOne(
    id: number,
    updateWishlistDto: CreateWishlistDto,
  ): Promise<void> {
    await this.wishlistRepository.update(id, updateWishlistDto);
  }

  async removeOne(id: number): Promise<void> {
    await this.wishlistRepository.delete(id);
  }
}
