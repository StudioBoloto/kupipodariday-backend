import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/CreateWishDto';
import { JwtGuard } from '../auth/auth.guard';

@Controller('wishes')
export class WishesController {
  private readonly logger = new Logger(WishesController.name);
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    this.logger.log(
      'Received create wish request with data: ' +
        JSON.stringify(createWishDto),
    );
    return this.wishesService.create(createWishDto, req?.user);
  }

  @Get('last')
  getLast() {
    this.logger.log('Received get last wishes request');
    return this.wishesService.findManyByKey({ createdAt: 'DESC' }, 40);
  }

  @Get('top')
  getTop() {
    this.logger.log('Received get top wishes request');
    return this.wishesService.findManyByKey({ copied: 'DESC' }, 10);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    this.logger.log('Received get wishes request with id: ' + id);
    return this.wishesService.findOne(id);
  }
}
