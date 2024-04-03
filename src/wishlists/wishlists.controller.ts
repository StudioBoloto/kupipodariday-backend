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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/CreateWishlistDto';
import { JwtGuard } from '../auth/auth.guard';

@Controller('wishlistlists')
export class WishlistsController {
  private readonly logger = new Logger(WishlistsController.name);
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  getAll() {
    this.logger.log('Received get all wishes request');
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    this.logger.log(
      'Received create wishlist request with data: ' +
        JSON.stringify(createWishlistDto),
    );
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getOne(@Param('id') id: number) {
    this.logger.log('Received get wishlist request with id: ' + id);
    return this.wishlistsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Body() updateWishlistDto: CreateWishlistDto,
    @Param('id') id: number,
    @Req() req,
  ) {
    this.logger.log(
      'Received update wishlist request with data: ' +
        JSON.stringify(updateWishlistDto),
    );
    return this.wishlistsService.updateOne(id, updateWishlistDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @Req() req) {
    this.logger.log('Received delete wishlist request with id: ' + id);
    return this.wishlistsService.removeOne(id, req.user);
  }
}
