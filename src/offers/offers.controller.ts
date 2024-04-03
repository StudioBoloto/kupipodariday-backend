import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtGuard } from '../auth/auth.guard';
import { CreateOfferDto } from './dto/CreateOfferDto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAll() {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return this.offersService.create(createOfferDto, req.user);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }
}
