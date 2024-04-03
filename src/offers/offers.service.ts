import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entity/offer.entity';
import { CreateOfferDto } from './dto/CreateOfferDto';
import { User } from '../users/entity/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const wishWithRaised = await this.wishesService.getWishWithRaised(
      createOfferDto.itemId,
    );
    const currentRaised = parseFloat(wishWithRaised.wish_raised);
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    if (wish.owner.id === user.id) {
      throw new BadRequestException('You cannot raise your own wish.');
    }
    if (currentRaised + createOfferDto.amount > wish.price) {
      throw new BadRequestException(
        'The amount cannot exceed the value of the gift.',
      );
    }
    const offer = this.offerRepository.create({
      user,
      item: wish,
      ...createOfferDto,
    });
    return this.offerRepository.save(offer);
  }

  async findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOne({ where: { id } });
  }

  async find(conditions: any): Promise<Offer[]> {
    return this.offerRepository.find(conditions);
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async updateOne(id: number, updateOfferDto: CreateOfferDto): Promise<void> {
    await this.offerRepository.update(id, updateOfferDto);
  }

  async removeOne(id: number): Promise<void> {
    await this.offerRepository.delete(id);
  }
}
