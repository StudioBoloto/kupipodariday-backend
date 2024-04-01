import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entity/offer.entity';
import { CreateOfferDto } from './dto/CreateOfferDto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = this.offerRepository.create(createOfferDto);
    return this.offerRepository.save(offer);
  }

  async findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOne({ where: { id } });
  }

  async find(conditions: any): Promise<Offer[]> {
    return this.offerRepository.find(conditions);
  }

  async updateOne(id: number, updateOfferDto: CreateOfferDto): Promise<void> {
    await this.offerRepository.update(id, updateOfferDto);
  }

  async removeOne(id: number): Promise<void> {
    await this.offerRepository.delete(id);
  }
}
