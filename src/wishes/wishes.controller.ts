import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/CreateWishDto';
import { JwtGuard } from '../auth/auth.guard';
import { UpdateWishDto } from './dto/UpdateWishDto';

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

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    this.logger.log(
      'Received update wish request with data: ' +
        JSON.stringify(updateWishDto),
    );
    return this.wishesService.updateOne(id, updateWishDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @Req() req) {
    this.logger.log('Received delete wish request with id: ' + id);
    return this.wishesService.removeOne(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() req) {
    this.logger.log('Received copy wish request with id: ' + id);
    return this.wishesService.copyOne(id, req.user);
  }
}
